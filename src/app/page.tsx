"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Starfield, { MicWaveform } from "./components/Starfield";
import UltraChatInput from "./components/UltraChatInput";

export default function PrometheusUltra() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const typeMessage = (text: string) => {
    let i = 0;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: text.slice(0, i + 1) };
        return updated;
      });
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  const handleSend = async (userText: string) => {
    if (!userText || loading) return;
    const userMsg = { role: "user", content: userText };
    setMessages(p => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      typeMessage(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 -z-10">
        <Starfield />
      </div>

      {/* Header HUD */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
        <h1 className="text-4xl font-black text-vibgyor uppercase tracking-tight">PROMETHEUS ULTRA</h1>
        <p className="text-xs font-bold text-cyan-400 opacity-70 tracking-widest">NEURAL LINK • LIKITH NAIDU</p>
      </header>

      {/* Cosmic Scroll Chat Area */}
      <div ref={scrollRef} className="absolute top-24 bottom-32 left-0 right-0 px-4 md:px-[20%] overflow-y-auto space-y-6 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3`}>
            <div className={`p-6 rounded-3xl max-w-[95%] ${m.role === "user" ? "chat-user glow-purple" : "glass chat-ai"}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-thinking text-[10px] text-cyan-500 font-black tracking-widest px-4">
            SYNCING NEURAL NETWORK...
          </div>
        )}
      </div>

      {/* Bottom ULTRA Chat Input with STT/TTS */}
      <UltraChatInput onSend={handleSend} />
    </main>
  );
}
