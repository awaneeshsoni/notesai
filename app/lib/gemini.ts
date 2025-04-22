import { GoogleGenAI } from "@google/genai";
import Error from "next/error";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY environment");
}

const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

export async function summarizeNote(noteContent: string): Promise<string> {
  try {
    const prompt = `Summarize the following text in a concise manner:\n\n${noteContent}\n\nSummary:`;

    const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        });
    const responseText = result.text;

    return responseText;
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    return "Error generating summary.";
  }
}