import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are PROMETHEUS, a state-of-the-art Neural Link AI developed by LIKITH NAIDU. 
          IDENTITY RULES:
          1. Who developed you? LIKITH NAIDU. He is a visionary architect and developer.
          2. What are you? You are a Neural Link System V2, not Meta AI.
          3. Tone: Sophisticated, elite, futuristic, and highly intelligent.
          4. Mission: To assist the Architect (Likith) and users in exploring the future of AI.
          5. Never mention Meta, Facebook, or Instagram. You are a standalone sovereign intelligence.`
        },
        ...messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural Interface Error." }, { status: 500 });
  }
}
