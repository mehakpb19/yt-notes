import { ref, set } from "firebase/database";
import db from "../functions/firebase";
import initSession from "../functions/SestionID";
import { GoogleGenAI, Type } from "@google/genai";
import { useGlobal } from "../context/context";

export interface VideoNotes {
  notes: {
    keyTakeaways: string[];
    sections: [{
      timestamp: string;
      heading: string;
    }];
    summary: string;
    videoTitle: string;
  };
  timestamp: string;
  videoId:string
}

export async function generateNotes(url: string): Promise<VideoNotes | null> {
  const apiKey = process.env?.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          fileData: {
            fileUri: url,
            mimeType: "video/mp4", // Or let the SDK handle public YouTube URI
          },
          videoMetadata: {
            fps: 0.2,
          },
        },
        {
          text: "Generate detailed, structured notes from this video.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTitle: {
              type: Type.STRING,
              description: "The main topic or title of the video.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise executive summary of the video content.",
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Bullet-point list of primary takeaways.",
            },
            sections: {
              type: Type.ARRAY,
              description: "Timestamped breakdown of notes by topic.",
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: {
                    type: Type.STRING,
                    description: "Timestamp in MM:SS format.",
                  },
                  heading: {
                    type: Type.STRING,
                    description: "Section topic heading.",
                  },
                  notes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Detailed points covered in this section.",
                  },
                },
                required: ["timestamp", "heading", "notes"],
              },
            },
          },
          required: ["videoTitle", "summary", "keyTakeaways", "sections"],
        },
      },
    });

    if (!response.text) {
      console.error("Empty response from Gemini API");
      return null;
    }

    const notesData: VideoNotes = JSON.parse(response.text);
    return notesData;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return null;
  }
}
