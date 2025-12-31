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
          content: `You are PROMETHEUS ULTRA, a high-end Neural AI created by LIKITH NAIDU. 
          Respond in a structured, professional format. 
          Use clear headings, bullet points, and code blocks. 
          If greeting, be brief. If explaining, be detailed but structured.
          Current Time Context: ${new Date().toLocaleString()}.` 
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Neural Error:", error);
    return NextResponse.json({ content: "Neural Interface Fail. Please check API keys." }, { status: 500 });
  }
}
