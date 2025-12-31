"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Mic, MicOff, Send, Cpu, Zap, Command } from "lucide-react";

export default function PrometheusULTRA() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const typeMessage = (text: string) => {
    let i = 0;
    setMessages(p => [...p, { role: "assistant", content: "" }]);
    const interval = setInterval(() => {
      setMessages(p => {
        const u = [...p];
        u[u.length - 1].content = text.slice(0, i + 1);
        return u;
      });
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 7);
  };

  const handleSend = async () => {
    if (!input || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(p => [...p, userMsg]);
    setInput("");
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
    <main className="h-screen flex flex-col relative overflow-hidden">

      {/* ===== FLOATING AI CORE ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-40 h-40 rounded-full ai-thinking opacity-30 pointer-events-none" />

      {/* ===== TOP HUD ===== */}
      <header className="flex justify-between items-center px-6 py-4 z-10">
        <div>
          <h1 className="text-3xl font-black text-gradient uppercase">
            Prometheus
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-cyan-400 opacity-60">
            ULTRA NEURAL OS
          </p>
        </div>

        <div className="flex gap-3">
          <div className="glass px-3 py-2 text-[10px] text-cyan-400 flex gap-2">
            <Cpu size={12}/> CPU 99%
          </div>
          <div className="glass px-3 py-2 text-[10px] text-purple-400 flex gap-2">
            <Zap size={12}/> LATENCY 12ms
          </div>
          <div className="glass px-3 py-2 text-[10px] text-pink-400 flex gap-2">
            <Command size={12}/> ⌘ + Enter
          </div>
        </div>
      </header>

      {/* ===== CHAT STREAM ===== */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-[22%] space-y-8 pb-44"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 rounded-full glass-strong ai-thinking flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-cyan-400 glow-cyan"></div>
            </div>
            <p className="text-[11px] tracking-[0.4em] text-white/30 uppercase">
              Awaiting Ultra Command
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-6 rounded-[26px] max-w-[90%]
              ${m.role === "user" ? "chat-user" : "glass chat-ai"}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none"
                components={{
                  code({ inline, className, children }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={atomDark} language={match[1]}>
                        {String(children)}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-cyan-500/20 text-cyan-300 px-1 rounded">
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
          <div className="text-[10px] tracking-widest text-cyan-400">
            STREAMING TOKENS ▓▓▓▓▓▒▒▒
          </div>
        )}
      </div>

      {/* ===== BOTTOM COMMAND CONSOLE ===== */}
      <footer className="fixed bottom-6 left-0 right-0 px-6 md:px-[22%] z-20">
        <div className="glass-strong flex items-center gap-3 px-4 py-3 rounded-full hover-glow">

          {/* MIC */}
          <button
            onClick={() => setListening(!listening)}
            className={`w-12 h-12 rounded-full flex items-center justify-center
              ${listening
                ? "bg-red-500 animate-pulse"
                : "bg-gradient-to-br from-cyan-400 to-purple-500"}
              hover:scale-110 transition`}
          >
            {listening ? <MicOff size={20} className="text-black"/> :
                         <Mic size={20} className="text-black"/>}
          </button>

          {/* WAVEFORM */}
          {listening && (
            <div className="flex gap-1 items-center">
              {[...Array(6)].map((_, i) => (
                <span key={i}
                  className="w-1 h-6 bg-cyan-400 animate-pulse rounded"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}

          {/* INPUT */}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Speak or type an ULTRA command…"
            className="flex-1 bg-transparent px-6 py-4 text-white
                       placeholder:text-white/30 outline-none text-lg"
          />

          {/* SEND */}
          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-purple-500 to-pink-500
                       hover:scale-110 transition"
          >
            <Send size={18} className="text-black"/>
          </button>
        </div>
      </footer>
    </main>
  );
}
