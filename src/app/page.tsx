"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ------------------ Types ------------------ */
type Message = {
  role: "user" | "assistant";
  content: string;
};

/* ------------------ Component ------------------ */
export default function PrometheusUltimate() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ------------------ Auto Scroll ------------------ */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typingText]);

  /* ------------------ Typing Effect ------------------ */
  const typeWriter = async (fullText: string) => {
    setIsTyping(true);
    setTypingText("");

    for (let i = 0; i < fullText.length; i++) {
      setTypingText((prev) => prev + fullText[i]);
      await new Promise((r) => setTimeout(r, 12)); // ⏱️ typing speed (ms)
    }

    setIsTyping(false);
    setMessages((p) => [...p, { role: "assistant", content: fullText }]);
    setTypingText("");
  };

  /* ------------------ Send Message ------------------ */
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading || isTyping) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      await typeWriter(data.content);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex flex-col font-sans">
      {/* Header */}
      <nav className="p-5 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0b0b0b]/80 backdrop-blur-xl z-50">
        <div>
          <h1 className="text-xl font-black tracking-tight">PROMETHEUS</h1>
          <p className="text-[9px] tracking-[0.35em] text-cyan-500 uppercase font-bold">
            Neural Architect · Likith Naidu
          </p>
        </div>
      </nav>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-10 md:max-w-4xl md:mx-auto space-y-10"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[95%] p-6 rounded-3xl ${
                m.role === "user"
                  ? "bg-[#161616] border border-white/10"
                  : "bg-white/5 border border-white/10 backdrop-blur-xl"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none"
                components={{
                  code({ inline, className, children }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="relative group my-6">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(String(children))
                          }
                          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 bg-white/10 px-3 py-1 rounded text-[10px]"
                        >
                          Copy
                        </button>
                        <SyntaxHighlighter style={atomDark} language={match[1]}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">
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

        {/* Typing Preview */}
        {isTyping && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <ReactMarkdown className="prose prose-invert max-w-none">
              {typingText + "▍"}
            </ReactMarkdown>
          </div>
        )}

        {loading && !isTyping && (
          <p className="text-cyan-500 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            Prometheus is reasoning...
          </p>
        )}
      </div>

      {/* Search / Command Input */}
      <footer className="p-6 bg-[#0b0b0b]">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything… (structured, exam-ready, precise)"
            className="
              w-full
              bg-[#121212]
              text-white
              border border-white/15
              rounded-2xl
              px-8
              py-5
              outline-none
              placeholder:text-zinc-500
              focus:border-cyan-500/70
              focus:ring-2
              focus:ring-cyan-500/20
              transition-all
            "
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bottom-3 bg-cyan-500 text-black px-8 rounded-xl font-black text-xs uppercase hover:scale-105 transition-transform"
          >
            Send
          </button>
        </form>

        <p className="text-center text-[8px] text-zinc-600 mt-6 tracking-[0.45em] uppercase font-bold">
          World-Class Neural UI · v3.0
        </p>
      </footer>
    </main>
  );
}
