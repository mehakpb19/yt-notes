import React, { useState } from "react";
import YouTube from "react-youtube";

let id;
export const getYouTubeId = (url: string) => {
  if (!url) return null;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  id = match && match[2].length === 11 ? match[2] : null;
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideoPlayer() {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  // If the URL is invalid or empty, prevent react-youtube from breaking
  if (!id) {
    return (
      <div className="error-message" style={{ color: "red", padding: "10px" }}>
        ⚠️ Invalid or unsupported YouTube URL.
      </div>
    );
  }

  return (
    <div className="video-container">
      <YouTube videoId={id} opts={opts} />
    </div>
  );
}
