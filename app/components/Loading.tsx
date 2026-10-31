"use client";

import { useState, useEffect } from "react";
import { useGlobal } from "../context/context";

const loadingMessages = [
  "Analyzing video content...",
  "Extracting the best notes...",
  "Generating timestamps...",
  "Summarizing key points...",
  "Almost there, formatting the text...",
  "Connecting the dots...",
  "Watching the video at 100x speed...",
  "Transcribing the audio track...",
  "Skipping the sponsor segments...",
  "Finding the golden nuggets...",
  "Structuring the final output...",
  "Brewing some smart notes...",
  "Polishing the grammar and syntax...",
  "Hold tight, AI magic in progress...",
  "Highlighting the most important parts...",
  "Organizing the timeline...",
  "Crunching the data...",
  "Preparing your study guide..."
];

export default function Loading() {
  const { isloading } = useGlobal();
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!isloading) return;
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * loadingMessages.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 2500); 
    return () => clearInterval(interval);
  }, [isloading]);

  if (!isloading) return null;

  return (
    <div className="w-full h-full bg-black/60 absolute z-10">
      <div className="flex-col gap-6 flex items-center justify-center absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
        </div>
        
        <p className="text-white text-lg font-semibold animate-pulse text-center px-4">
          {loadingMessages[textIndex]}
        </p>
      </div>
    </div>
  );
}