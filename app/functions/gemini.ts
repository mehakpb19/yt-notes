"use client";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function generateText() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash", // Fast text generation model
      contents: "Explain asynchronous JavaScript in one short sentence.",
    });

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
  }
}
