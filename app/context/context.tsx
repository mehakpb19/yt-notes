"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { VideoNotes } from "../hooks/useGetnotes";

interface GlobalContextType {
  ytUrl: string;
  setYtUrl: (ytUrl: string) => void;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  id: string | null;
  setId: (id: string | null) => void;
  sessionKey: string | null;
  setSessionKey: (sessionKey: string | null) => void;
  data: VideoNotes | null;
  setData: (data: VideoNotes | null) => void;
  isloading: boolean | null;
  setIsloading: (isloading: boolean | null) => void;
  time: number | null;
  setTime: (time: number | null) => void;
  seekTrigger: number;
  triggerSeek: (seconds: number) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [ytUrl, setYtUrl] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [id, setId] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [data, setData] = useState<VideoNotes | null>(null);
  const [isloading, setIsloading] = useState<boolean | null>(false);
  const [time, setTime] = useState<number | null>(0);
  const [seekTrigger, setSeekTrigger] = useState<number>(0);

  // Updates both the live time (for immediate UI glow) and triggers the YouTube player to seek
  const triggerSeek = (seconds: number) => {
    setTime(seconds);
    setTimestamp(seconds);
    setSeekTrigger((prev) => prev + 1);
  };

  return (
    <GlobalContext.Provider
      value={{
        ytUrl,
        setYtUrl,
        timestamp,
        setTimestamp,
        id,
        setId,
        sessionKey,
        setSessionKey,
        data,
        setData,
        isloading,
        setIsloading,
        time,
        setTime,
        seekTrigger,
        triggerSeek,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}