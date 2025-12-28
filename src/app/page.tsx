"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrometheusAtoZ() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white flex flex-col items-center p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-7xl z-10 flex flex-col h-[92vh]">
        <header className="text-center py-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff00ff] animate-pulse">
            PROMETHEUS
          </h1>
          <p className="text-[#00f3ff] text-[10px] tracking-[1.2em] font-bold mt-2 opacity-70">ARCHITECT: LIKITH NAIDU</p>
        </header>

        <div className="flex-1 glass-card border border-white/10 rounded-[40px] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] bg-black/40 backdrop-blur-3xl">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scrollbar-hide">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 border-2 border-purple-500 rounded-full animate-pulse opacity-40"></div>
                  <div className="absolute inset-4 border-2 border-pink-500 rounded-full"></div>
                </div>
                <p className="text-xs font-black tracking-widest uppercase">Identity Verified: Likith Naidu</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                <div className={`p-6 rounded-[30px] max-w-[85%] border shadow-2xl ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-br from-[#bc13fe]/40 to-indigo-600/40 border-[#bc13fe]/30 text-white' 
                  : 'bg-white/5 border-white/10 text-cyan-50 font-light'
                }`}>
                  <p className="leading-relaxed text-sm md:text-lg">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && <div className="text-[#ff00ff] animate-bounce text-[10px] font-black uppercase">Syncing Neural Data...</div>}
          </div>

          <form onSubmit={handleSend} className="p-8 bg-black/60 border-t border-white/5">
            <div className="flex gap-4 max-w-5xl mx-auto relative group">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-10 py-6 outline-none focus:border-[#00f3ff]/50 transition-all text-white placeholder-white/10 text-lg"
                placeholder="Neural link ready..."
              />
              <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff00ff] px-12 rounded-2xl font-black text-black uppercase hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                {loading ? '...' : 'EXECUTE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
