"use client";
import React, { useState, useRef, useEffect } from "react";
import UltraInput, { useSpeech } from "./components/UltraInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PrometheusUltraPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const typeMessage = (text: string) => {
    let i = 0;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = text.slice(0, i + 1);
        return updated;
      });
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    // AI echo + TTS
    typeMessage(`Echo: ${text}`);
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-[#020617] to-[#0a0a2e] relative flex flex-col">
      {/* Header */}
      <header className="text-center py-6">
        <h1 className="text-4xl font-black text-vibgyor uppercase">PROMETHEUS ULTRA</h1>
        <p className="text-xs tracking-widest text-cyan-400 mt-1">NEURAL LINK • LIKITH NAIDU</p>
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-4 pb-32"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[80%] 
                ${m.role === "user"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"}`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-white/10 px-1 py-0.5 rounded font-mono" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-center ULTRA Input */}
      <UltraInput onSend={handleSend} />
    </main>
  );
}
