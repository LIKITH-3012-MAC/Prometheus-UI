import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

/**
 * Initialize GROQ client
 * API Key is securely read from environment variables
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * POST /api/chat
 * Handles chat completion requests for PROMETHEUS AI
 */
export async function POST(req: Request) {
  try {
    // ❌ Guard clause: API key missing
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { content: "Server misconfiguration: API key missing." },
        { status: 500 }
      );
    }

    // 📥 Parse incoming request
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { content: "Invalid request format." },
        { status: 400 }
      );
    }

    // 🤖 Call GROQ Chat Completion
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are **PROMETHEUS**, a high-end Neural Link AI developed by **LIKITH NAIDU**.

RESPONSE STYLE RULES (STRICT):
1. Always start with: 🔹 Title / Topic
2. Use clear headings with ## and ###.
3. Prefer bullet points (•) and numbered steps.
4. For code:
   - Use triple backticks
   - Mention the language (e.g., \`\`\`ts, \`\`\`js)
5. End every response with:
   - 📌 Key notes
   - ⚠️ Common mistakes (if applicable)
6. Use emojis sparingly and meaningfully.
7. Tone must be:
   - Sophisticated
   - Helpful
   - Exam-friendly
   - Developer-friendly

Do NOT produce messy paragraphs.
Do NOT remove structure.
`,
        },
        ...messages,
      ],
    });

    // 📤 Send assistant response
    return NextResponse.json({
      content: response.choices?.[0]?.message?.content ?? "No response generated.",
    });

  } catch (error: any) {
    console.error("❌ PROMETHEUS API ERROR:", error);

    return NextResponse.json(
      { content: "Neural link failure. Please retry." },
      { status: 500 }
    );
  }
}
