import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { cleanResponse, applyEmojiRules } from '@/lib/cleanResponse';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are PROMETHEUS, built by LIKITH NAIDU. Follow the Enterprise Protocol." },
        ...messages
      ],
      temperature: 0.7,
    });

    let aiContent = response.choices[0].message.content || "";
    aiContent = cleanResponse(aiContent);
    aiContent = applyEmojiRules(aiContent);

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    return NextResponse.json({ error: "Neural Interface Fail" }, { status: 500 });
  }
}
