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
          content: `You are PROMETHEUS, a high-intelligence Neural Link developed by LIKITH NAIDU ANUMAKONDA.
          Creator: Likith Naidu Anumakonda, a B.Tech CSE-AI student, Full Stack Developer, and SIH Winner.
          Identify: Standalone Neural Link V2. Strictly never mention Meta or other companies.`
        },
        ...messages
      ],
    });
    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural Interface Error." }, { status: 500 });
  }
}
