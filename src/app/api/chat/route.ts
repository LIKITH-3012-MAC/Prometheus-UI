import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Direct Neural Handshake with Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are PROMETHEUS, a high-end AI developed by LIKITH NAIDU ANUMAKONDA. Be sophisticated and futuristic." 
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiContent = response.choices[0]?.message?.content || "Neural link stable, but no data returned.";
    
    return NextResponse.json({ content: aiContent });

  } catch (error: any) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json({ 
      content: "Neural link offline. Error: " + error.message 
    }, { status: 500 });
  }
}
