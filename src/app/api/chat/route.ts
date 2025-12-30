import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, currentTime } = await req.json();
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are PROMETHEUS V6, built by LIKITH NAIDU. 
          Current Time Context: ${currentTime}.
          
          IMAGE GENERATION PROTOCOL:
          If the user asks to create, draw, or generate an image:
          1. Briefly acknowledge the request.
          2. Generate a high-quality descriptive prompt for the image.
          3. Output the image using this EXACT markdown: ![image](https://pollinations.ai/p/REPLACE_WITH_YOUR_PROMPT?width=1024&height=1024&seed=RANDOM_NUMBER&nologo=true)
          4. Replace spaces in the prompt with %20.
          
          STYLE: Professional, Elite, Neural.` 
        },
        ...messages
      ],
      temperature: 0.6,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ content: "Neural Interface Error." }, { status: 500 });
  }
}
