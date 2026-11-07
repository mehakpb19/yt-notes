"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGlobal } from "../context/context";
import initSession from "../functions/SestionID";
import { listenToProduct, updateVideoTime } from "../functions/FirebaseActions";

interface Section {
  heading: string;
  notes: string[];
  timestamp: string;
}

interface NotesData {
  videoTitle: string;
  summary: string;
  sections: Section[];
}

const parseTimestampToSeconds = (timestamp: string): number => {
  if (!timestamp) return 0;
  const parts = timestamp.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

export default function Notes() {
  const {
    data,
    sessionKey,
    setSessionKey,
    setId,
    setData,
    time,
    setTime,
    triggerSeek,
  } = useGlobal();

  const [collapsedSections, setCollapsedSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActiveIndexRef = useRef<number>(-1);

  useEffect(() => {
    const key = initSession();
    setSessionKey(key);
    const fnc = async () => {
      const res = await listenToProduct(key);
      if (res !== null) {
        setId(res.videoId);
        setData(res);
        if (typeof res.currentTime === "number") {
          setTime(res.currentTime);
        }
      }
    };
    fnc();
  }, [setSessionKey, setId, setData, setTime]);

  const notesData: NotesData | undefined = (data as any)?.notes ?? data;
  const currentSeconds = time ?? 0;

  useEffect(() => {
    if (!notesData || !Array.isArray(notesData.sections)) return;

    const activeIdx = notesData.sections.findIndex((sec, idx) => {
      const start = parseTimestampToSeconds(sec.timestamp);
      const next = notesData.sections[idx + 1];
      const end = next ? parseTimestampToSeconds(next.timestamp) : Infinity;
      return currentSeconds >= start && currentSeconds < end;
    });
    if (activeIdx !== -1 && activeIdx !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = activeIdx;
      sectionRefs.current[activeIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentSeconds, notesData]);

  if (!notesData || !Array.isArray(notesData.sections)) {
    return null;
  }

  const toggleSection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedSections((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const handleSectionSelect = (startSeconds: number, index: number) => {
    triggerSeek(startSeconds);

    if (sessionKey) {
      updateVideoTime(sessionKey, startSeconds);
    }

    setCollapsedSections((prev) => prev.filter((item) => item !== index));
  };

  return (
    <article className="w-full max-w-3xl lg:max-w-160 lg:w-5/12 xl:w-160 shrink-0 mx-auto p-4 sm:p-6 max-h-[70vh] lg:max-h-[calc(100vh-8rem)] overflow-y-auto bg-[#02213a]/50 scrollbar-none text-slate-200 rounded-xl sm:rounded-2xl shadow-xl border border-slate-800">
      {/* Header & Summary */}
      <header className="mb-6 sm:mb-8 border-b border-slate-800 pb-4 sm:pb-6">
        <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/50 rounded-full">
          Video Breakdown
        </div>
        <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-white mb-3 sm:mb-4 leading-snug">
          {notesData.videoTitle}
        </h1>
        <div className="p-3.5 sm:p-4 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
            Executive Summary
          </h2>
          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm md:text-base">
            {notesData.summary}
          </p>
        </div>
      </header>

      {/* Timeline Sections */}
      <section aria-label="Video Chapters" className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800 hidden sm:block" />

        <div className="space-y-4 sm:space-y-6">
          {notesData.sections.map((section: Section, index: number) => {
            const isCollapsed = collapsedSections.includes(index);
            const startSeconds = parseTimestampToSeconds(section.timestamp);
            const nextSection = notesData.sections[index + 1];
            const endSeconds = nextSection
              ? parseTimestampToSeconds(nextSection.timestamp)
              : Infinity;

            const isCurrentActive =
              currentSeconds >= startSeconds && currentSeconds < endSeconds;

            return (
              <div
                key={`${section.timestamp}-${index}`}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className="relative sm:pl-12 transition-all"
              >
                {/* Timeline Dot */}
                <div
                  className={`hidden sm:flex absolute left-2.5 top-4 w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isCurrentActive
                      ? "bg-cyan-400 ring-4 ring-cyan-500/30 shadow-[0_0_12px_#22d3ee] scale-110"
                      : "bg-cyan-500/50 ring-4 ring-slate-950"
                  }`}
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSectionSelect(startSeconds, index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSectionSelect(startSeconds, index);
                    }
                  }}
                  className="w-full text-left hover:-translate-y-0.5 ease-in-out transition-all active:translate-y-0 duration-150 cursor-pointer"
                >
                  <div
                    className={`rounded-xl p-3.5 sm:p-5 transition-all duration-300 border ${
                      isCurrentActive
                        ? "bg-slate-900/95 border-cyan-500/80 shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/40"
                        : "bg-slate-900/60 active:bg-slate-900/60 hover:bg-slate-900 border-slate-800/90"
                    }`}
                  >
                    <div className="flex flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Timestamp Badge */}
                        <span
                          title="Jump to timestamp"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSectionSelect(startSeconds, index);
                          }}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                            isCurrentActive
                              ? "text-slate-950 bg-cyan-400 border border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)] font-bold"
                              : "text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60"
                          }`}
                        >
                          <svg
                            className="w-3 h-3 fill-current shrink-0"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {section.timestamp}
                        </span>

                        <h3
                          className={`text-base sm:text-lg font-semibold leading-snug warp-words transition-colors ${
                            isCurrentActive ? "text-cyan-300" : "text-white"
                          }`}
                        >
                          {section.heading}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleSection(index, e)}
                        className="shrink-0 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded cursor-pointer ml-auto"
                        aria-expanded={!isCollapsed}
                      >
                        {isCollapsed ? "Show Notes" : "Hide Notes"}
                      </button>
                    </div>

                    {!isCollapsed && (
                      <ul className="space-y-2 sm:space-y-2.5 mt-3 pt-3 border-t border-slate-800/60">
                        {section.notes.map((note: string, noteIdx: number) => (
                          <li
                            key={noteIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed"
                          >
                            <span
                              className={`mt-1.5 sm:mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                                isCurrentActive
                                  ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                                  : "bg-blue-400/80"
                              }`}
                            />
                            <span className="warp-words">{note}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}