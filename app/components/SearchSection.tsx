"use client";

import { useState } from "react";
import { useGlobal } from "../context/context";

export default function SearchSection() {
  const { ytUrl, setYtUrl } = useGlobal();
  const [error, setError] = useState<string>("");
  return (
    <div className="relative flex items-center w-full max-w-2xl mx-auto group">
      <div className="absolute left-4 text-[#79CBCA]/80 pointer-events-none transition-colors duration-300 group-focus-within:text-[#79CBCA]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      </div>

      <div className="w-full">
        <input
          type="text"
          value={ytUrl}
          onChange={(e) => setYtUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="w-full py-3.5 pl-12 pr-36 text-white placeholder-slate-300/60 bg-linear-to-r from-[#354961] to-[#4a6f9c] bg-origin-border rounded-2xl border-none outline-none ring-2 ring-transparent transition-all duration-500 focus:ring-[#79C7CB] focus:shadow-[0_0_20px_rgba(120,194,204,0.4)]"
        />
        <p
          className={`absolute top-full left-4 mt-2 flex items-center gap-1.5 text-sm font-medium text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)] transition-all duration-300 ease-out ${
            error
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={async () => {
          const isFormateValid = extractYoutubeId(ytUrl);
          if (isFormateValid === "") {
            setError("no valid url");
            return;
          }

          console.log("do");
          // if (!await getasdf(isFormateValid)) return;
        }}
        className="absolute right-1.5 px-6 py-2.5 rounded-xl font-semibold bg-linear-to-r from-[#77A1D3] via-[#79CBCA] to-[#77A1D3] bg-size-[200%_auto] hover:bg-right shadow-[0_0_15px_rgba(120,194,204,0.5)] hover:shadow-[0_0_25px_rgba(120,194,204,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-400 cursor-pointer"
      >
        Get Notes
      </button>
    </div>
  );
}

const extractYoutubeId = (url: string): string => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};
