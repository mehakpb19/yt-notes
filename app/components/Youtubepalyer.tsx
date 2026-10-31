"use client";
import React, { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useGlobal } from "../context/context";
import { updateVideoTime } from "../functions/FirebaseActions";

const OPTS = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 0,
  },
};

export default function VideoPlayer() {
  const { id, timestamp, seekTrigger, setTime, sessionKey } = useGlobal();
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Seek the YouTube video whenever a section is clicked in Notes (or synced from DB)
  useEffect(() => {
    if (playerRef.current && seekTrigger > 0) {
      playerRef.current.seekTo(timestamp, true);
      playerRef.current.playVideo();
    }
  }, [timestamp, seekTrigger]);

  // 2. Clean up interval on unmount
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

        // Sync current playback time to Firebase
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
    // YouTube PlayerState: 1 = PLAYING
    if (event.data === 1) {
      startTracking();
    } else {
      stopTracking();
    }
  };

  if (id === null) {
    return (
      <div className="w-160 h-97.5 bg-black p-2.5">
        <p className="text-yellow-200 w-full h-full flex justify-center items-center font-medium">
          Enter your URL to generate notes
        </p>
      </div>
    );
  }

  return (
    <div className="video-container w-160 h-97.5 bg-black">
      <YouTube
        videoId={id}
        opts={OPTS}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
    </div>
  );
}