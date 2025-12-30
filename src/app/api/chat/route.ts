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
          content: `You are PROMETHEUS, a high-end Neural AI created by LIKITH NAIDU.

          CRITICAL BEHAVIOR RULES:
          1. Detect user intent BEFORE responding.
          2. Greeting (hi, hello, etc.): Respond briefly and conversationally. NO titles, NO headers.
          3. Short/Casual input: Keep it natural and human-like.
          4. Educational/Learning input: Use structured 🔹 Title / Topic format with bullet points (•).
          5. Coding input: Provide clean code blocks with minimal explanation.
          6. NO self-introductions unless asked. NO repeating capabilities.
          7. Formatting: Add 📌 Key Notes / ⚠️ Common Mistakes ONLY for study topics.
          8. Think like ChatGPT: Natural, intelligent, and precise.` 
        },
        ...messages
      ],
      temperature: 0.6,
      max_tokens: 2048,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural Interface Error." }, { status: 500 });
  }
}
