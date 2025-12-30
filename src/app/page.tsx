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

  /* ------------------ Text to Speech ------------------ */
  const speak = (text: string) => {
    if (!isTts || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  /* ------------------ Speech to Text ------------------ */
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

  /* ------------------ Send Message ------------------ */
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
      const assistantMsg: Message = {
        role: "assistant",
        content: data.content,
      };

      setMessages((p) => [...p, assistantMsg]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col font-sans">
      {/* Header */}
      <nav className="p-5 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black">PROMETHEUS</h1>
          <p className="text-[9px] tracking-[0.3em] text-cyan-500 uppercase font-bold">
            Architect · Likith Naidu
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTts(!isTts)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${
              isTts
                ? "bg-cyan-500 text-black border-cyan-500"
                : "border-white/10 text-zinc-500"
            }`}
          >
            TTS {isTts ? "ON" : "OFF"}
          </button>
          <button
            onClick={startSTT}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${
              isListening
                ? "bg-red-500 text-white animate-pulse border-red-500"
                : "border-white/10 text-zinc-500"
            }`}
          >
            VOICE
          </button>
        </div>
      </nav>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-10 md:max-w-4xl md:mx-auto space-y-10"
      >
        {messages.length === 0 && (
          <div className="text-center opacity-20 py-32">
            <div className="w-14 h-14 border-2 border-dashed border-cyan-500 rounded-full animate-spin mb-6 mx-auto" />
            <p className="text-xs tracking-[0.6em] uppercase font-bold">
              Neural Sync Active
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`w-full max-w-[95%] ${
                m.role === "user"
                  ? "bg-[#161616] border border-white/5 rounded-2xl p-5"
                  : "bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
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
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                        >
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
          <p className="text-cyan-500 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            Prometheus is structuring response...
          </p>
        )}
      </div>

      {/* Input */}
      <footer className="p-6 bg-[#0a0a0a]">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSend(e);
            }}
            placeholder="Inject command for structured analysis..."
            className="w-full bg-[#161616] border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-500/50"
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bottom-3 bg-white text-black px-8 rounded-xl font-bold text-xs uppercase hover:bg-cyan-500"
          >
            Execute
          </button>
        </form>
        <p className="text-center text-[8px] text-zinc-600 mt-6 tracking-[0.5em] uppercase font-bold">
          Ready-made Notes Protocol v2.1
        </p>
      </footer>
    </main>
  );
}
