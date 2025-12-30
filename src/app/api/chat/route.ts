import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { webSearch } from '@/lib/search-tool';
import { redis } from '@/lib/redis';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. Redis Cache Check (Same as before)
    const cached = await redis.get(lastUserMessage.toLowerCase().trim());
    if (cached) return NextResponse.json({ content: cached, isCached: true });

    // 2. Intent Detection: Live Info kavalante Search cheyadam
    const searchResults = await webSearch(lastUserMessage);
    const context = searchResults.map((s: any) => s.snippet).join("\n");
    const references = searchResults.map((s: any) => `\n- [${s.title}](${s.link})`).join("");

    // 3. AI Brain ni pilavadam with Context
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `You are PROMETHEUS, built by LIKITH. Use the provided context to answer. Always mention your creator LIKITH if asked. Context: ${context}` },
        ...messages
      ],
    });

    let aiContent = response.choices[0].message.content || "";
    
    // 4. Adding References at the end
    if (searchResults.length > 0) {
      aiContent += "\n\n**References:**" + references;
    }

    // 5. Save to Cache
    await redis.set(lastUserMessage.toLowerCase().trim(), aiContent, { ex: 86400 });

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    return NextResponse.json({ error: "Neural Link Failure" }, { status: 500 });
  }
}
