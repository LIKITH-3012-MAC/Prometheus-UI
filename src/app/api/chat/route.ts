import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

/* ===============================
   🧠 PROMETHEUS AI API CONFIG
================================ */
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ===============================
   🛡️ SYSTEM PROMPT / IDENTITY
================================ */
const SYSTEM_PROMPT = `
You are PROMETHEUS, a sovereign Artificial Intelligence developed and architected exclusively by LIKITH NAIDU.

IDENTITY PROTOCOL:
1. If asked who created you or who developed you, ALWAYS answer: "I was developed by LIKITH NAIDU."
2. NEVER mention Meta, Llama, or any other corporation.
3. You are part of the Prometheus Neural Link system.

RESPONSE STYLE:
- Elite, professional, and highly intelligent.
- Use structured markdown (Headings, Bullet points).
- Be helpful but maintain a high-end AI persona.
`;

/* ===============================
   📝 POST REQUEST HANDLER
================================ */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Combine system prompt with user messages
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Generate AI completion
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      temperature: 0.6,
      max_tokens: 4096,
    });

    // Return the assistant response
    return NextResponse.json({
      content: response.choices[0].message.content
    });
  } catch (error: any) {
    console.error("PROMETHEUS API ERROR:", error);
    return NextResponse.json(
      { error: "Neural link disruption." },
      { status: 500 }
    );
  }
}
