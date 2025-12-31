import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { messages, currentTime } = await req.json();
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ content: "⚠️ ERROR: GROQ_API_KEY is missing in Vercel settings. Please add it and re-deploy." });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are PROMETHEUS, a high-end AI created by LIKITH NAIDU. 
          Current Context: ${currentTime}. Respond in a structured, professional format.` 
        },
        ...messages
      ],
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Neural Error:", error);
    return NextResponse.json({ content: "❌ Neural Link Timeout: " + error.message }, { status: 500 });
  }
}
