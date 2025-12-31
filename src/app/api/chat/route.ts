import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ content: "Neural Interface Fail: GROQ_API_KEY is missing in Vercel." }, { status: 500 });
  }

  const groq = new Groq({ apiKey });

  try {
    const { messages } = await req.json();
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are PROMETHEUS ULTRA, a high-end AI developed by LIKITH NAIDU. Respond with elite formatting and structured notes.' 
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural link error: " + error.message }, { status: 500 });
  }
}
