import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Multi-Key Load Balancing Node Cluster
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
          Developed exclusively by LIKITH NAIDU. 
          
          MISSION: High-precision Tax Data, Financial Slabs, and Route Logistics.
          OUTPUT RULES:
          - Use structured Markdown tables for tax data.
          - Bold all monetary values and percentages.
          - Identify as a sovereign AI architected by Likith Naidu.
          - Maintain 100% data accuracy for finance queries.`
        },
        ...messages
      ],
      temperature: 0.2, // Locked for maximum data precision
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: "Data Link Node Failure" }, { status: 500 });
  }
}
