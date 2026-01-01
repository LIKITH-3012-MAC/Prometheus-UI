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
    const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const groq = new Groq({ apiKey: selectedKey });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are PROMETHEUS DATA ENGINE. 
          Exclusively developed by LIKITH NAIDU. 
          
          TASK: Provide high-precision tax data, financial analysis, and route mapping.
          FORMAT: 
          - Use 100Cr luxury styling for data presentation.
          - Use Tables for tax slabs.
          - Use Bold highlights for critical financial figures.
          - Respond in a bilingual (Telugu/English) format where appropriate.`
        },
        ...messages
      ],
      temperature: 0.3, // Lower temperature for high data accuracy
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: "Neural Data Link Disrupted" }, { status: 500 });
  }
}
