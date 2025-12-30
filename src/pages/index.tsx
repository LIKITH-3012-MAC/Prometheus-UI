"use client";
import React, { useState, useEffect, useRef } from "react";
import '../styles/globals.css';

export default function PrometheusEnterprise() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("dark");
  const [isTts, setIsTts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const speak = (text: string) => {
    if (!isTts) return;
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: "user", content: input };
    setMessages(p => [...p, userMsg]);
    setInput("");
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });
    const data = await res.json();
    setMessages(p => [...p, { role: "assistant", content: data.content }]);
    speak(data.content);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] transition-all duration-500">
      <nav className="p-6 border-b border-[var(--border)] flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter">PROMETHEUS <span className="text-cyan-500 text-xs">ENT-V1</span></h1>
        <div className="flex gap-2">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="px-4 py-2 rounded-full border border-[var(--border)] text-[10px] font-bold uppercase">Mode: {theme}</button>
          <button onClick={() => setIsTts(!isTts)} className="px-4 py-2 rounded-full border border-[var(--border)] text-[10px] font-bold uppercase">{isTts ? 'TTS ON' : 'TTS OFF'}</button>
          <button onClick={startSTT} className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase ${isListening ? 'bg-red-500 text-white' : 'border-[var(--border)]'}`}>Voice</button>
        </div>
      </nav>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
            <div className={`p-6 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-cyan-500 text-black font-bold' : 'bg-[var(--surface)] border border-[var(--border)]'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <footer className="p-6 bg-black/20 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-white/5 border border-[var(--border)] rounded-xl px-6 py-4 outline-none focus:border-cyan-500" placeholder="Ask Prometheus anything..." />
          <button onClick={sendMessage} className="bg-white text-black px-10 rounded-xl font-black text-xs uppercase hover:bg-cyan-500">Execute</button>
        </div>
      </footer>
    </div>
  );
}
