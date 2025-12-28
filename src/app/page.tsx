"use client";
import React, { useState, useEffect, useRef } from "react";

export default function PrometheusSupreme() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState('dark');
  const scrollRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
    const userMsg = { role: 'user', content: input };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: data.content }]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center p-4 md:p-8 transition-colors duration-500">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase" style={{color: theme === 'dark' ? '#00f3ff' : '#0070f3'}}>PROMETHEUS</h1>
          <p className="text-[9px] tracking-[0.3em] opacity-50 uppercase">Architect: Likith Naidu</p>
        </div>
        
        <div className="flex gap-2 bg-zinc-500/10 p-1 rounded-full border border-zinc-500/20">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-white text-black uppercase shadow-sm">
            {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
          <button onClick={() => setIsTts(!isTts)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${isTts ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-zinc-800 text-zinc-500'}`}>TTS</button>
          <button onClick={startSTT} className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${isListening ? 'bg-red-500 border-red-500 animate-pulse' : 'border-zinc-800 text-zinc-500'}`}>VOICE</button>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-6xl glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-500">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center opacity-20 text-[10px] tracking-[1em] uppercase font-bold">System Online</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`p-5 rounded-2xl max-w-[85%] text-sm md:text-base ${m.role === 'user' ? 'bg-cyan-500 text-black font-semibold' : 'bg-zinc-500/10 border border-zinc-500/20'}`}>
                {m.content}
                {m.role === 'assistant' && (
                  <div className="mt-3 flex gap-4 text-[9px] uppercase tracking-widest font-bold opacity-60 border-t border-zinc-500/20 pt-3">
                    <button onClick={() => speak(m.content)}>Replay</button>
                    <button onClick={() => navigator.clipboard.writeText(m.content)}>Copy</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-500 text-[10px] font-bold animate-pulse uppercase tracking-[0.5em]">Syncing...</div>}
        </div>

        <form onSubmit={handleSend} className="p-6 border-t border-zinc-500/10">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-zinc-500/5 border border-zinc-500/10 rounded-xl px-6 py-4 text-sm outline-none focus:border-cyan-500 transition-all" placeholder="Enter command..." />
            <button type="submit" className="bg-zinc-900 text-white dark:bg-white dark:text-black px-10 rounded-xl font-black text-[10px] uppercase transition-all">Execute</button>
          </div>
        </form>
      </div>
    </main>
  );
}
