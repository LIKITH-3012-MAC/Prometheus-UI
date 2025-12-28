import { exportMarkdown, exportPDF } from "@/utils/exportChat";
"use client";
import React, { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function PrometheusProduct() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* Text to Speech */
  const speak = (text: string) => {
    if (!ttsEnabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  /* Speech to Text */
  const startSTT = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported");

    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) =>
      setInput(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        role: "assistant",
        content: data.content,
      };
      setMessages((m) => [...m, aiMsg]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold">
            Prometheus <span className="text-cyan-400">v3.0</span>
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
            Developed by Likith Naidu
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/60 p-1 rounded-full border border-zinc-800">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-semibold ${
              ttsEnabled ? "bg-cyan-500 text-black" : "text-zinc-400"
            }`}
          >
            TTS {ttsEnabled ? "ON" : "OFF"}
          </button>

          <button
            onClick={startSTT}
            className={`px-4 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-2 ${
              listening
                ? "bg-red-500/90 text-white"
                : "text-zinc-400"
            }`}
          >
            {listening ? (
              <>
                <span>LISTENING</span>
                <div className="voice-wave">
                  <span className="voice-bar" />
                  <span className="voice-bar" />
                  <span className="voice-bar" />
                  <span className="voice-bar" />
                </div>
              </>
            ) : (
              "VOICE"
            )}
          </button>
        </div>
      </nav>

      {/* Chat */}
      <div className="glass-panel w-full max-w-6xl flex-1 rounded-2xl flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-500 text-xs tracking-widest uppercase">
              System Ready
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } animate-in`}
            >
              <div
                className={`max-w-[85%] px-5 py-4 rounded-xl text-sm md:text-base leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyan-500 text-black font-medium"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-cyan-400 text-[10px] tracking-widest animate-pulse">
              PROCESSING…
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 md:p-6 border-t border-zinc-800 bg-zinc-900/30">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 neural-input rounded-xl px-5 py-4 text-sm md:text-base"
              placeholder="Type or speak your command…"
            />
            <button
              type="submit"
              className="px-7 rounded-xl bg-white text-black text-xs font-bold uppercase hover:bg-cyan-500 transition"
            >
              Execute
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-4 text-[9px] text-zinc-600 tracking-widest uppercase">
        © 2025 Likith Naidu Anumakonda • AI Product Interface
      </footer>
    </main>
  );
}
