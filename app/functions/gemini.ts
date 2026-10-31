"use client"
import { GoogleGenAI } from "@google/genai";

// Initialize the client. It automatically picks up the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

async function generateText() {
  try {
    const interaction = await ai.create({
      model: "gemini-3.8-flash", // Use "gemini-3.8-flash" for fast text generation
      input: "Explain asynchronous JavaScript in one short sentence.",
    });

    return "heeeeeeeeeee";
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
  }
}
