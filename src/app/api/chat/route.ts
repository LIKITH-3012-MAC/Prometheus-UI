import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })),
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
