"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusAtoZ() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------- SCROLL ENGINE ---------- */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollPct(Math.min(100, Math.max(0, pct)));
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  /* ---------- SPEECH ---------- */
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ""));
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  };

  const startSTT = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) =>
      setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  /* ---------- CHAT ---------- */
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
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
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Neural Core Offline." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#05070c] text-white overflow-hidden">
      {/* 🌌 PARALLAX BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(0,120,255,0.06),transparent_45%)]" />

      {/* 📊 SCROLL HUD */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 h-40 w-1 bg-white/10 rounded-full">
        <div
          className="bg-cyan-400 w-full rounded-full transition-all duration-200"
          style={{ height: `${scrollPct}%` }}
        />
      </div>

      {/* 🧠 HEADER */}
      <header className="relative z-40 h-24 flex justify-between items-center px-10 border-b border-white/5 backdrop-blur-3xl bg-black/40">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight uppercase">
            Prometheus
          </h1>
          <p className="text-[10px] tracking-[0.5em] text-cyan-400 opacity-70">
            SOVEREIGN INTELLIGENCE • LIKITH NAIDU
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={startSTT}
            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest border ${
              isListening
                ? "text-red-400 border-red-500 animate-pulse"
                : "text-cyan-400 border-cyan-400/30"
            }`}
          >
            {isListening ? "LISTENING..." : "VOICE"}
          </button>
          <div className="px-4 py-2 text-[10px] rounded-full border border-white/10 text-zinc-400">
            V.70B
          </div>
        </div>
      </header>

      {/* 💬 CHAT STREAM */}
      <section
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-30 h-[calc(100vh-240px)] overflow-y-auto px-6 md:px-[22%] py-16 space-y-12 scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] p-8 rounded-[36px] shadow-2xl ${
                m.role === "user"
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-black font-bold"
                  : "bg-white/5 backdrop-blur-2xl border border-white/10"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none"
                components={{
                  code({ inline, className, children }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="my-6 rounded-2xl overflow-hidden">
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                        >
                          {String(children)}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/20 px-2 py-1 rounded">
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
          <p className="text-cyan-400 animate-pulse text-xs tracking-widest">
            SYNCHRONIZING NEURAL CORE…
          </p>
        )}
      </section>

      {/* ⌨️ INPUT BAR */}
      <footer className="relative z-40 h-36 flex items-center justify-center bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="w-full max-w-4xl flex gap-4 px-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-black/60 border border-white/10 backdrop-blur-2xl px-8 py-6 rounded-full text-xl outline-none caret-cyan-400"
            placeholder="Inject sovereign instruction…"
          />
          <button
            onClick={handleSend}
            className="bg-white text-black px-12 rounded-full font-black hover:bg-cyan-400 transition-all"
          >
            EXECUTE
          </button>
        </div>
      </footer>
    </main>
  );
}
