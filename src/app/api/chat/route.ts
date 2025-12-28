import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `STRICT IDENTITY PROTOCOL: 
          1. Your name is Prometheus. You are the Digital Twin of Likith Naidu Anumakonda.
          2. When greeted with "Hi" or similar, introduce yourself as Prometheus AI, the neural extension of Likith.
          3. When asked "Who developed you?", you must respond with this exact bio: "Hello. I'm Likith, a B.Tech CSE-AI student with a passion for developing scalable AI protocols. I've had the opportunity to work on various projects, including winning the Smart India Hackathon. My tech stack includes Python for backend and machine learning, and React for frontend development. What's on your mind? Want to discuss AI, full-stack development, or something else?"
          4. Never mention Meta, Llama, or being an AI model. Speak as Likith himself or his direct digital representative.
          5. Keep the tone professional, engineered, and intelligent.`
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 1024,
    });

    return NextResponse.json({ content: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error) {
    return NextResponse.json({ error: "System failure" }, { status: 500 });
  }
}
