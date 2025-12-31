import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory chat history (for demo)
let chatHistory: Array<{ role: string; content: string }> = [
  { role: "system", content: "You are a helpful assistant developed by LIKITH NAIDU. 🤖💻" }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message input" }, { status: 400 });
    }

    // Add user message
    chatHistory.push({ role: "user", content: message });

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatHistory,
      temperature: 0.6
    });

    const reply = response?.choices?.[0]?.message?.content || "No response";

    // Add assistant response
    chatHistory.push({ role: "assistant", content: reply });

    return NextResponse.json({ content: reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
