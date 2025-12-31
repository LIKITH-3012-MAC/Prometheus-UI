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
          content: 'You are PROMETHEUS ULTRA, a high-end AI developed by LIKITH NAIDU. Respond with elite formatting and structured notes.' 
        },
        ...messages
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content || "Neural Core is silent. Check API key.";
    return NextResponse.json({ content: aiResponse });
  } catch (error: any) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json({ content: "Neural link error: " + error.message }, { status: 500 });
  }
}
