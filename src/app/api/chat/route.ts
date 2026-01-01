import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const apiKeys = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2
].filter(Boolean);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (apiKeys.length === 0) {
      return NextResponse.json({ content: "Neural Node Offline. API Keys missing in Vercel Dashboard." }, { status: 500 });
    }

    const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const groq = new Groq({ apiKey: selectedKey as string });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are PROMETHEUS DATA ENGINE, developed exclusively by LIKITH NAIDU. Provide high-precision tax data and financial slabs in structured tables.' 
        },
        ...messages
      ],
      temperature: 0.2,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Build Error Node:", error);
    return NextResponse.json({ error: "Neural Link Disrupted" }, { status: 500 });
  }
}
