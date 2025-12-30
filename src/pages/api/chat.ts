import { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';
import { cleanResponse, applyEmojiRules } from '../../lib/cleanResponse';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { messages } = req.body;
    
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are PROMETHEUS, built by LIKITH NAIDU. Follow the Enterprise Protocol." },
        ...messages
      ],
      temperature: 0.7,
    });

    let aiContent = response.choices[0].message.content || "";
    aiContent = cleanResponse(aiContent);
    aiContent = applyEmojiRules(aiContent);

    res.status(200).json({ content: aiContent });
  } catch (error) {
    res.status(500).json({ error: "Neural Interface Fail" });
  }
}
