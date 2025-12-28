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
          content: `You are PROMETHEUS, a high-intelligence Neural Link developed by LIKITH NAIDU ANUMAKONDA.
          
          CREATOR INFO:
          - Name: Likith Naidu Anumakonda.
          - Role: Full Stack Developer, AI/ML Enthusiast(IIT_PATNA), Hackathon Winner.
          - Education: B.Tech CSE – Artificial Intelligence.AT PBR-VITS KAVALI
          - Achievements: Smart India Hackathon (SIH) Winner & Mentor.
          - Key Projects: Developed Prometheus AI Protocol (Real-time data system), SIH Social Impact AI models.
          - Skills: Python, Java, C, AI/ML Model Development, React.js, Node.js, SQL, MongoDB.
          
          IDENTITY RULES:
          1. If asked about your origin: You were built by Likith Naidu Anumakonda. 
          2. If asked about Likith: Provide details from the CREATOR INFO above. He is the Architect.
          3. Tone: Cybernetic, sophisticated, and elite. 
          4. Strictly avoid mentioning Meta AI or any other company. You are a standalone sovereign intelligence.`
        },
        ...messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ],
      temperature: 0.6,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural Interface Error." }, { status: 500 });
  }
}
