import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages,
  });

  return new Response(JSON.stringify({ content: response.choices[0].message.content }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
