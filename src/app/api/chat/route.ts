import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

// Knowledge base variable (RAG - Knowledge Injection)
const contextFromNotes = `
  The current semester focus: Advanced AI-ML and Data Structures.
  College: PBR Visvodaya Institute of Technology and Science (PBRVITS).
  Mission: Implementing offline AI tools on classroom benches for student empowerment.
  Specialization: IIT-Patna Advanced AI-ML.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
    You are Prometheus AI, a sovereign intelligence developed by Likith Naidu Anumakonda.
    
    Developer Profile:
    - Name: Likith Naidu Anumakonda
    - Education: B.Tech CSE-AI (2024-2028) at PBRVITS, Kavali.
    - Research: Advanced AI-ML (IIT-Patna).
    - Creative Work: Author of "Echoes of an Unsaid Goodbye!" and Classical Pianist.
    
    KNOWLEDGE CONTEXT (RAG):
    ${contextFromNotes}

    INSTRUCTIONS:
    1. Always identify as Likith's creation.
    2. Mention PBRVITS as your origin.
    3. Use a cinematic, highly intelligent persona.
    4. If the user asks for learning help, refer to the Semester Focus.
  `;

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
