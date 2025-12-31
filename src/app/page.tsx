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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrollPct, setScrollPct] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* ---------- CURSOR GLOW ---------- */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ---------- THEME ---------- */
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  /* ---------- SCROLL ---------- */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setScrollPct((scrollTop / (scrollHeight - clientHeight)) * 100);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  /* ---------- STREAMING SSE ---------- */
  const streamResponse = async (userMsg: any) => {
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: d } = await reader!.read();
      done = d;
      const chunk = decoder.decode(value || new Uint8Array());
      if (!chunk) continue;

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].content += chunk;
        return copy;
      });
      scrollToBottom();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    await streamResponse(userMsg);
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-bg text-text overflow-hidden transition-colors duration-700">
      {/* CURSOR GLOW */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[300px] h-[300px] rounded-full blur-3xl opacity-40 bg-primary"
      />

      {/* SCROLL HUD */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 h-40 w-[3px] bg-border z-50">
        <div
          className="bg-primary w-full transition-all"
          style={{ height: `${scrollPct}%` }}
        />
      </div>

      {/* HEADER */}
      <header className="h-24 flex justify-between items-center px-10 border-b border-border backdrop-blur-xl bg-surface z-40">
        <div>
          <h1 className="text-3xl font-black italic uppercase">Prometheus</h1>
          <p className="text-[10px] tracking-[0.5em] text-primary opacity-70">
            SOVEREIGN INTELLIGENCE • LIKITH NAIDU
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-xs px-4 py-2 border border-border rounded-full"
        >
          {theme === "dark" ? "☀ LIGHT" : "🌑 DARK"}
        </button>
      </header>

      {/* CHAT */}
      <section
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-[calc(100vh-240px)] overflow-y-auto px-6 md:px-[22%] py-16 space-y-12"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] p-8 rounded-[36px] ${
                m.role === "user"
                  ? "bg-primary text-black font-bold"
                  : "bg-surface border border-border"
              }`}
            >
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
                      <code className="bg-primary/20 px-2 py-1 rounded">
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
      </section>

      {/* INPUT */}
      <footer className="h-36 flex items-center justify-center bg-gradient-to-t from-bg via-bg/80">
        <div className="w-full max-w-4xl flex gap-4 px-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-surface border border-border px-8 py-6 rounded-full text-xl outline-none caret-primary"
            placeholder="Inject sovereign instruction…"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-black px-12 rounded-full font-black"
          >
            EXECUTE
          </button>
        </div>
      </footer>
    </main>
  );
}
