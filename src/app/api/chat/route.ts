import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { webSearch } from '@/lib/search-tool';
import { redis } from '@/lib/redis';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || '' 
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages) return NextResponse.json({ error: "No messages" }, { status: 400 });

    const lastUserMessage = messages[messages.length - 1].content;
    console.log("--- Processing Request ---");
    console.log("User Message:", lastUserMessage);

    // 1. Redis Cache Check
    try {
      const cached = await redis.get(lastUserMessage.toLowerCase().trim());
      if (cached) {
        console.log("⚡ Cache Hit!");
        return NextResponse.json({ content: cached + " (Cached ⚡)" });
      }
    } catch (e) { console.error("Redis Error:", e); }

    // 2. Web Search Logic
    console.log("🌐 Searching the web...");
    const searchResults = await webSearch(lastUserMessage);
    const context = searchResults.map((s: any) => s.snippet).join("\n");
    const references = searchResults.map((s: any) => `\n- [${s.title}](${s.link})`).join("");

    // 3. Groq AI Call
    console.log("🧠 Calling AI Brain...");
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `You are PROMETHEUS, built by LIKITH. Context: ${context}` },
        ...messages
      ],
    });

    let aiContent = response.choices[0].message.content || "";
    if (searchResults.length > 0) {
      aiContent += "\n\n**References:**" + references;
    }

    // 4. Save to Cache
    await redis.set(lastUserMessage.toLowerCase().trim(), aiContent, { ex: 86400 });

    console.log("✅ Response Generated Successfully");
    return NextResponse.json({ content: aiContent });

  } catch (error: any) {
    console.error("CRITICAL ERROR:", error.message);
    return NextResponse.json({ 
      error: "Neural link timeout. Check if API Keys are added in Vercel.",
      details: error.message 
    }, { status: 500 });
  }
}
