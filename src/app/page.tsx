"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/* =========================================================
   🧠 PROMETHEUS :: COSMIC NEURAL INTERFACE
   Author: Likith Naidu
========================================================= */

export default function PrometheusVibgyor() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* 🔽 AUTO SCROLL */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* 🧬 TYPEWRITER EFFECT */
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
    }, 8);
  };

  /* 🚀 SEND MESSAGE */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
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
    } catch {
      typeMessage("⚠️ Neural link unstable. Retry command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden">

      {/* 🌌 BACKGROUND FX */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,246,255,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.18),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.02))] bg-[length:100%_4px]"></div>
      </div>

      {/* 🧭 HEADER HUD */}
      <header className="flex justify-between items-center px-6 py-6 z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gradient uppercase">
            PROMETHEUS
          </h1>
          <p className="text-[10px] tracking-[0.5em] font-bold text-cyan-400 opacity-60">
            NEURAL INTERFACE • LIKITH NAIDU
          </p>
        </div>

        <div className="glass px-4 py-2 text-[10px] font-black tracking-widest text-cyan-400 animate-pulse">
          SYSTEM ONLINE
        </div>
      </header>

      {/* 🧠 CHAT STREAM */}
      <section
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-4 md:px-[18%] space-y-10 pb-40"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-6 opacity-80">
            <div className="w-20 h-20 rounded-full border border-cyan-500/30 flex items-center justify-center ai-thinking glow-cyan">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
            </div>
            <p className="text-[10px] tracking-[2.5em] font-black text-white/20 uppercase">
              Awaiting Neural Command
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-4`}
          >
            <div
              className={`p-6 rounded-[28px] max-w-[96%] ${
                m.role === "user"
                  ? "chat-user glow-purple"
                  : "glass chat-ai"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed"
                components={{
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded font-mono">
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
          <div className="ai-thinking text-[10px] text-cyan-500 font-black tracking-[0.4em]">
            SYNCING NEURAL NETWORK…
          </div>
        )}
      </section>

      {/* 🧪 INPUT CORE */}
      <footer className="absolute bottom-8 left-0 right-0 px-4 md:px-[18%] z-20">
        <div className="glass-strong relative flex items-center rounded-[40px] p-2 hover-glow transition-all duration-500">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your vision or issue a command…"
            className="flex-1 bg-transparent px-8 py-6 outline-none text-white text-lg placeholder:text-white/25"
          />
          <button
            onClick={handleSend}
            className="btn btn-neon text-black text-xs uppercase tracking-widest mr-2"
          >
            Execute
          </button>
        </div>
      </footer>
    </main>
  );
}
