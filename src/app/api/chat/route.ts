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
          content: 'You are PROMETHEUS, a high-end AI developed by LIKITH NAIDU. Respond with elite precision. Use markdown for headings and bullet points. Be human-like and sophisticated.' 
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: "Neural link timeout. Check API key." }, { status: 500 });
  }
}
