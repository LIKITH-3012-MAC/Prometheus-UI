"use client";
import React, { useState, useEffect, useRef } from "react";

export default function PrometheusNeuralOS() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default Dark
  const scrollRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const speak = (text) => {
    if (!isTts) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input || loading) return;
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center p-4 md:p-8 transition-colors duration-500">
      {/* Dynamic Navigation Bar */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Prometheus <span className="text-cyan-500 font-mono text-sm">V3.1</span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] opacity-50 font-bold uppercase">Architect: Likith Naidu</p>
        </div>

        <div className="flex gap-2 bg-zinc-900/10 p-1.5 rounded-full border border-zinc-500/20 backdrop-blur-md">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all bg-white text-black shadow-lg"
          >
            Mode: {theme}
          </button>
          <button 
            onClick={() => setIsTts(!isTts)} 
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${isTts ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-zinc-500/30 text-zinc-500'}`}
          >
            TTS {isTts ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={startSTT} 
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${isListening ? 'bg-red-500 border-red-500 animate-pulse text-white' : 'border-zinc-500/30 text-zinc-500'}`}
          >
            Voice
          </button>
        </div>
      </nav>

      {/* Adaptive Dashboard Interface */}
      <div className="glass-panel w-full max-w-6xl h-full rounded-[40px] flex flex-col overflow-hidden relative shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center opacity-20 text-[10px] tracking-[2em] uppercase font-black text-center">
              Awaiting Neural Handshake
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`p-6 rounded-[24px] max-w-[85%] text-sm md:text-base leading-relaxed ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai shadow-sm'}`}>
                {m.content}
                {m.role === 'assistant' && (
                  <div className="mt-4 flex gap-5 text-[9px] font-black uppercase tracking-widest opacity-50 border-t border-zinc-500/10 pt-4">
                    <button onClick={() => speak(m.content)} className="hover:text-cyan-500">Replay</button>
                    <button onClick={() => navigator.clipboard.writeText(m.content)} className="hover:text-cyan-500">Copy</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-500 text-[10px] font-black animate-pulse uppercase tracking-[1em] ml-4">Thinking...</div>}
        </div>

        {/* Cyber Input Terminal */}
        <form onSubmit={handleSend} className="p-8 bg-black/5 border-t border-zinc-500/10">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-white/5 border border-zinc-500/20 rounded-2xl px-8 py-5 outline-none focus:border-cyan-500 transition-all text-base" 
              placeholder="Inject command..." 
            />
            <button type="submit" className="bg-white text-black px-12 rounded-2xl font-black text-xs uppercase hover:bg-cyan-500 transition-all active:scale-95 shadow-xl">
              Execute
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
