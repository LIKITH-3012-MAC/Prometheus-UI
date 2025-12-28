import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const response = await groq.chat.completions.create({
      // Updated to the latest versatile model
      model: 'llama-3.3-70b-versatile',
      messages: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Neural Error:", error);
    return NextResponse.json({ 
      content: "Neural link error: " + (error.response?.data?.error?.message || error.message) 
    }, { status: 500 });
  }
}
