"use client";
import React, { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useGlobal } from "../context/context";
import { updateVideoTime } from "../functions/FirebaseActions";

const OPTS = {
  height: "100%",
  width: "100%",
  playerVars: {
    autoplay: 0,
  },
};

export default function VideoPlayer() {
  const { id, timestamp, seekTrigger, setTime, sessionKey } = useGlobal();

  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playerRef.current && seekTrigger > 0) {
      playerRef.current.seekTo(timestamp, true);
      playerRef.current.playVideo();
    }
  }, [timestamp, seekTrigger]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTracking = () => {
    stopTracking();
    intervalRef.current = setInterval(async () => {
      if (playerRef.current) {
        const currentSeconds = Math.floor(
          await playerRef.current.getCurrentTime()
        );
        setTime(currentSeconds);

        if (sessionKey) {
          updateVideoTime(sessionKey, currentSeconds);
        }
      }
    }, 1000);
  };

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  const handleStateChange = (event: YouTubeEvent<number>) => {
    if (event.data === 1) {
      startTracking();
    } else {
      stopTracking();
    }
  };

  if (id === null) {
    return (
      <div className="w-full aspect-video bg-black p-4 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-800/80 shadow-xl">
        <p className="text-yellow-200 w-full h-full flex justify-center items-center text-center text-sm sm:text-base font-medium px-2">
          Enter your URL to generate notes
        </p>
      </div>
    );
  }

  return (
    <div className="video-container w-full h-fit aspect-video bg-black overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-slate-800/80">
      <YouTube
        videoId={id}
        opts={OPTS}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}