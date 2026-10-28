"use client";
import React from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useGlobal } from "../context/context";

export const getYouTubeId = (url: string) => {
  if (!url) return null;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer() {
  const { ytUrl, setYtUrl, id, setId } = useGlobal();

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  if (!id) {
    if(id ===''){
      return(
        <div className="error-message w-160 h-97.5 bg-black p-2.5">
      </div>
      )
    }
    return (
      <div className="error-message w-160 h-97.5 bg-black  text-red-600 p-2.5 flex justify-center items-center">
        <p className="translate-y-5 transition-all duration-700">
          
          ⚠️ Invalid or unsupported YouTube URL.
          </p>
      </div>
    );
  }

  return (
    <div className="video-container">
      <YouTube videoId={id} opts={opts} />
    </div>
  );
}
