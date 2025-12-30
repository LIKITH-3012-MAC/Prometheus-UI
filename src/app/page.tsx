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

export default function PrometheusUltimate() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ------------------ Auto Scroll ------------------ */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ------------------ TTS ------------------ */
  const speak = (text: string) => {
    if (!isTts || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    window.speechSynthesis.speak(u);
  };

  /* ------------------ STT ------------------ */
  const startSTT = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Speech recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) =>
      setInput(e.results[0][0].transcript);
    recognition.start();
  };

  /* ------------------ Send ------------------ */
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

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
      setMessages((p) => [...p, { role: "assistant", content: data.content }]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#050505] to-black text-[#eaeaea] flex flex-col font-sans">
      {/* Header */}
      <nav className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black tracking-tight">PROMETHEUS</h1>
          <p className="text-[9px] tracking-[0.4em] text-cyan-400 uppercase font-bold">
            Neural Architect · Likith Naidu
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTts(!isTts)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              isTts
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            TTS {isTts ? "ON" : "OFF"}
          </button>
          <button
            onClick={startSTT}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              isListening
                ? "bg-red-500 animate-pulse text-white"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            VOICE
          </button>
        </div>
      </nav>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-12 md:max-w-4xl md:mx-auto space-y-10"
      >
        {messages.length === 0 && (
          <div className="text-center opacity-25 py-32">
            <div className="w-16 h-16 border-2 border-dashed border-cyan-500 rounded-full animate-spin mb-6 mx-auto" />
            <p className="text-xs tracking-[0.6em] uppercase font-bold">
              Neural Sync Active
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[95%] p-6 ${
                m.role === "user"
                  ? "bg-[#121212] border border-white/10 rounded-2xl"
                  : "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl"
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
                          onClick={() => navigator.clipboard.writeText(String(children))}
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

        {loading && (
          <p className="text-cyan-400 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            Structuring neural response...
          </p>
        )}
      </div>

      {/* WORLD-CLASS SEARCH BAR INPUT */}
      <footer className="sticky bottom-0 p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <div className="flex items-center gap-4 bg-[#0f0f0f] border border-white/10 rounded-full px-6 py-4 shadow-2xl focus-within:border-cyan-500/50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSend(e);
              }}
              placeholder="Search, ask, or command Prometheus…"
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base caret-cyan-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-tr from-cyan-400 to-blue-500 text-black px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg"
            >
              EXECUTE
            </button>
          </div>
        </form>
        <p className="text-center text-[8px] text-zinc-600 mt-4 tracking-[0.4em] uppercase font-bold">
          Neural Interface · Production Grade
        </p>
      </footer>
    </main>
  );
}
