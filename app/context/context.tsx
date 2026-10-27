// src/context/GlobalContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the shape of your global state
interface GlobalContextType {
  ytUrl: string ;
  setYtUrl: (ytUrl: string) => void;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
}

// 2. Create the context with a default undefined value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// 3. Create the provider component
export function GlobalProvider({ children }: { children: ReactNode }) {
  const [ytUrl, setYtUrl] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{ ytUrl, setYtUrl, timestamp, setTimestamp }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// 4. Create a custom hook for easy consumption
export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
