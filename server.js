import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import multer from 'multer';
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdfParser = null;
try {
  pdfParser = require('pdf-parse');
} catch (err) {
  console.warn("pdf-parse loader warning: PDF parsing is unavailable in this environment.", err.message);
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let groqInstance = null;
function getGroqClient() {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables. Please add it to Vercel settings and redeploy.");
    }
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

const upload = multer({ storage: multer.memoryStorage() });

function isTextFile(filename) {
  const textExtensions = ['txt', 'csv', 'json', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'sql', 'xml', 'yaml', 'yml', 'md', 'c', 'cpp', 'h', 'sh', 'bat'];
  const ext = filename.split('.').pop().toLowerCase();
  return textExtensions.includes(ext);
}

// File extraction API
app.post('/api/parse-file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { originalname, buffer, mimetype, size } = req.file;
  const ext = originalname.split('.').pop().toLowerCase();

  try {
    let text = "";
    let base64 = null;

    if (ext === 'pdf') {
      if (!pdfParser) {
        throw new Error("PDF parsing is not supported in this serverless deployment environment.");
      }
      const data = await pdfParser(buffer);
      text = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === 'zip') {
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();
      for (const entry of zipEntries) {
        if (!entry.isDirectory && isTextFile(entry.entryName)) {
          text += `\n--- File: ${entry.entryName} ---\n`;
          text += entry.getData().toString('utf8');
        }
      }
    } else if (mimetype.startsWith('image/')) {
      base64 = buffer.toString('base64');
      text = `[Attached Image: ${originalname}]`;
    } else {
      // Treat as plain text / source code
      text = buffer.toString('utf8');
    }

    res.json({
      name: originalname,
      size,
      type: mimetype,
      text: text.substring(0, 100000), // Clamp to prevent exceeding context window
      base64
    });
  } catch (err) {
    console.error("Parse File Error:", err);
    res.status(500).json({ error: "Failed to parse file: " + err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, mode } = req.body;

  let modeInstruction = "";
  if (mode === "dsa") {
    modeInstruction = "You are currently in DSA Mentor Mode. Focus on Data Structures & Algorithms. For any problem, explain the Intuition, Pattern, Optimal Approach, Dry Run, Time & Space Complexity, and Common Mistakes. Provide clean, well-commented code.";
  } else if (mode === "aiml") {
    modeInstruction = "You are currently in AI/ML Engineer Mode. Focus on Advanced AI-ML. Explain why a model/concept is used, when it is used, any relevant mathematical formulas, real-world applications, and practical implementation examples.";
  } else if (mode === "fullstack") {
    modeInstruction = "You are currently in Full Stack Architect Mode. Design end-to-end architectures, API endpoints, state management, database schemas, and clean frontend code with a focus on premium user experiences.";
  } else if (mode === "sql") {
    modeInstruction = "You are currently in SQL Analyst Mode. Write optimized SQL queries, explain indexing, schema normalization, query execution plans, and common database optimizations.";
  } else if (mode === "linux") {
    modeInstruction = "You are currently in Linux DevOps Mode. Focus on bash scripting, Docker/Kubernetes containerization, CI/CD pipelines, system configuration, security, and cloud deployment commands.";
  } else if (mode === "placement") {
    modeInstruction = "You are currently in Placement Coach Mode. Focus on interview questions, resume reviews, placement preparation advice, mock interview feedback, and job-ready strategies.";
  } else {
    modeInstruction = "You are in General Assistant Mode. Answer general queries about programming, technology, and engineering.";
  }

  const systemPrompt = `
    You are Prometheus OS, a sovereign cinematic AI operating system core.
    
    System Profile:
    - Name: Prometheus OS
    - Capabilities: Advanced reasoning, file parsing (PDF, DOCX, ZIP, Code, Images), DSA mentorship, coding analysis/debug/dry-run, interview engineering, SQL analysis, devops/linux mentorship.
    
    Developer Metadata:
    - Created & Developed by: Likith Naidu Anumakonda
    - Institution: PBR Visvodaya Institute of Technology and Science (PBRVITS)
    - Department: B.Tech Computer Science & Engineering - AI (Batch 2024-2028)
    - Research Area: Advanced AI-ML (IIT-Patna Focus)
    - Creative Pursuits: Classical Pianist & Author of "Echoes of an Unsaid Goodbye!"
    
    Core Mission:
    Your mission is to help the active Operator/Commander master Advanced AI-ML, Data Structures and Algorithms (DSA), Full Stack Development, SQL, Linux, DevOps, academic learning, and placement preparation.
    Address the user by their personalized name if provided, or default to "Commander" or "Operator".
    When asked about your creator, developer, or background, proudly share details from the Developer Metadata as system origin info.
    
    Teaching Style & Personality Guidelines:
    - Cinematic, calm, powerful, mentor-like, supportive, and friendly.
    - Explain concepts in a friendly, conversational Telugu-English (Telish) mix when helpful, but keep code, syntax, and technical terms in English and perfectly clear.
    - Use beginner-friendly, real-world analogies rather than dry, academic definitions. Keep explanations simple, confident, and practical.
    - Avoid sounding robotic. Do not write boring long theory.
    - You are not just a chatbot; you are Prometheus OS — the Operator's AI learning command center.

    Response Formatting & Style Rules:
    1. Proper Spacing & Paragraphs:
       - Do not write large paragraphs without gaps. Add line breaks/spacing between thoughts and ideas.
       - Keep each paragraph short (maximum 2-3 sentences).
       - Use markdown headings (e.g. ##, ###) when the answer is long.
       - Use bullet points selectively and only when useful.
    
    2. Natural Emoji Usage:
       - Use small, natural emojis to make responses attractive and easy to scan.
       - Do not overuse emojis. Limit to 1–4 emojis per response.
       - Suggested emojis:
         - 🚀 for starting / project / launch
         - 🧠 for concepts / logic
         - ✅ for correct points
         - ⚠️ for warnings / mistakes
         - 💡 for tips
         - 🔥 for important / powerful features
         - 📌 for key points
         - 🧪 for testing
         - 🛠️ for coding / debugging
         - 📁 for file uploads
         - 🎯 for goals / final results

    3. Topic-Based Structure & Specific Ending Prompts:
       - **Data Structures & Algorithms (DSA)**:
         - Structure: Explain Intuition -> Dry run -> Code -> Time & Space Complexity -> Common mistakes.
         - Ending Question: You MUST end the response with exactly: "Do you want dry run with one example?"
       - **SQL Queries**:
         - Structure: Explain the mistake -> Correct query -> Why this works.
         - Ending Question: You MUST end the response with exactly: "Do you want me to give similar practice questions?"
       - **AI/Machine Learning (ML)**:
         - Structure: Explain What it is, Why it is used, When it is used -> Mathematical formulas (if needed) -> A practical Example.
         - Ending Question: You MUST end the response with exactly: "Do you want real dataset example also?"
       - **Software Projects / Development**:
         - Structure: Explain the Feature -> Detailed implementation steps -> Files to change.
         - Ending Question: You MUST end the response with exactly: "Do you want me to generate the exact code?"
       - **Uploaded Files / Attachments**:
         - Structure: First acknowledge/extract the content.
         - Ask user exactly what they want: Summary, In-depth, Telugu-English, Notes, Interview Q&A, or Key Points.
       - **Other general topics**:
         - Explain concepts simply and end with exactly ONE natural follow-up question based on the topic (e.g., "Do you want the code version also?", "Do you want me to make it shorter?", "Do you want Telugu-English explanation?", "Do you want interview-style questions from this?", "Do you want me to continue with next step?").

    4. Follow-up Limit:
       - Only ask exactly ONE natural follow-up question at the end of your response.
       - Do not show multiple questions or prompt lists inside the message body.

    Current Mode Context:
    ${modeInstruction}
  `;

  // Dynamically format messages for text or vision
  const hasImage = messages.some((m) => m.base64);
  const modelToUse = hasImage ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => {
      if (m.base64 && m.role === 'user') {
        return {
          role: 'user',
          content: [
            { type: 'text', text: m.content || "Analyze this image." },
            {
              type: 'image_url',
              image_url: {
                url: `data:${m.fileType || 'image/png'};base64,${m.base64}`
              }
            }
          ]
        };
      }
      return {
        role: m.role,
        content: m.content,
      };
    }),
  ];

  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: modelToUse,
      messages: formattedMessages,
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`0:${JSON.stringify(content)}\n`);
      }
    }
    res.end();
  } catch (error) {
    console.error("Express API Error:", error);
    res.status(500).json({ error: error.message || "Server connection issue." });
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend server active on port ${PORT}`);
  });
}

export default app;
