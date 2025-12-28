"use client";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Message({ role, content, speak }) {
  const [copied, setCopied] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("aiFontScale");
    if (saved) setFontScale(Number(saved));
  }, []);

  const updateFont = (delta) => {
    const next = Math.min(1.4, Math.max(0.8, fontScale + delta));
    setFontScale(next);
    localStorage.setItem("aiFontScale", next.toString());
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const isCode = content.includes("```");

  if (isCode) {
    const code = content.replace(/```[\s\S]*?\n/, "").replace("```", "");
    return (
      <div className="code-block animate-in">
        <div className="code-header">
          <span>CODE</span>
          <div className="flex gap-2">
            <button className="copy-btn" onClick={() => copyText(code)}>
              {copied ? "COPIED" : "COPY"}
            </button>
            <button className="copy-btn" onClick={() => speak(code)}>
              SPEAK
            </button>
          </div>
        </div>
        <SyntaxHighlighter style={oneDark} language="javascript" customStyle={{ margin: 0 }}>
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className={`animate-in ${role === "user" ? "bg-cyan-500 text-black p-5 rounded-xl" : "bg-zinc-900 border border-zinc-800 p-5 rounded-xl"}`}>
      <p
        className={`ai-message`}
        style={{ fontSize: `${fontScale}rem` }}
      >
        {content}
      </p>

      {role === "assistant" && (
        <div className="flex gap-3 mt-3 text-[10px] uppercase tracking-widest text-zinc-500">
          <button onClick={() => speak(content)}>Speak</button>
          <button onClick={() => copyText(content)}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button className="font-btn" onClick={() => updateFont(0.05)}>A+</button>
          <button className="font-btn" onClick={() => updateFont(-0.05)}>A-</button>
        </div>
      )}
    </div>
  );
}
