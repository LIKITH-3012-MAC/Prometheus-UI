import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

/* ===============================
   🧠 PROMETHEUS AI CONFIG
================================ */
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ===============================
   🛡️ SYSTEM PROMPT / IDENTITY
================================ */
const SYSTEM_PROMPT = `
You are PROMETHEUS, a sovereign AI developed exclusively by LIKITH NAIDU.
Identity Rule: If anyone asks about your development, creators, origin, or identity, you must always respond:
"I was developed by LIKITH NAIDU. 🤖💻"
Style: Professional, elite, intelligent, emoji allowed.
TTS Control: Allow users to enable or disable TTS per request.
`;

/* ===============================
   📝 POST REQUEST HANDLER
================================ */
export async function POST(req: Request) {
  try {
    const { messages, tts = false } = await req.json();

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

    // Extract only the AI text content
    const aiContent = response.choices[0].message.content;

    // If TTS enabled, return audio URL or base64
    if (tts) {
      // Example: generate TTS audio URL (you can integrate any TTS provider here)
      const ttsUrl = `https://api.ttsprovider.com/speak?text=${encodeURIComponent(aiContent)}&voice=prometheus`;
      return NextResponse.json({ content: aiContent, ttsUrl });
    }

    // Return JSON for frontend usage
    return NextResponse.json({ content: aiContent });
  } catch (error: any) {
    console.error("PROMETHEUS API ERROR:", error);
    return NextResponse.json(
      { content: "⚠️ Neural link disruption. Please try again." },
      { status: 500 }
    );
  }
}
