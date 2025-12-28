"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrometheusNeuralOS() {
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
    <main className="h-screen w-screen flex flex-col relative overflow-hidden bg-black">
      <div className="star-bg"></div>
      
      {/* HUD Elements */}
      <div className="hud-corner top-left animate-pulse"></div>
      <div className="hud-corner bottom-right animate-pulse"></div>

      {/* Top Navigation / Status */}
      <nav className="w-full p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-6 h-6 bg-cyan-500 rounded-full blur-sm"></div>
          </div>
          <div>
            <h1 className="glitch text-xl font-black tracking-[0.3em] text-white">PROMETHEUS <span className="text-cyan-400">OS</span></h1>
            <p className="text-[8px] text-cyan-500/60 font-bold uppercase tracking-widest">Architect: Likith Naidu</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">
          <div className="flex flex-col items-end">
            <span>Uptime</span>
            <span className="text-white">99.98%</span>
          </div>
          <div className="flex flex-col items-end">
            <span>Neural Load</span>
            <span className="text-cyan-400">1.2ms</span>
          </div>
        </div>
      </nav>

      {/* Neural Link Terminal (Messages) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-10 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
             <div className="text-cyan-500 text-6xl opacity-10 animate-pulse">∞</div>
             <p className="text-[10px] tracking-[1.5em] font-black text-white/20 uppercase">Awaiting Neural Handshake</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative p-6 max-w-[90%] md:max-w-[70%] border ${
              m.role === 'user' 
              ? 'bg-purple-500/5 border-purple-500/50 text-white' 
              : 'bg-cyan-500/5 border-cyan-500/50 text-cyan-50'
            }`}>
              {/* Message Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-inherit border-t border-l border-current"></div>
              <p className="text-sm md:text-base tracking-wide font-light italic leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-400 text-[10px] animate-pulse font-bold ml-2">SYNCING WITH NEURAL CORE...</div>}
      </div>

      {/* Control Console */}
      <div className="p-6 md:p-10 border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <form onSubmit={handleSend} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white/5 border-l-4 border-cyan-500 px-8 py-5 outline-none focus:bg-white/10 transition-all text-white font-mono text-sm uppercase tracking-widest"
              placeholder="Inject Neural Payload..."
            />
            <div className="absolute top-0 right-0 p-2 text-[8px] text-cyan-500/40">INPUT_MOD: V2.1</div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="group relative px-16 py-5 overflow-hidden border border-cyan-500 font-black text-xs uppercase tracking-[0.5em] transition-all hover:bg-cyan-500 hover:text-black"
          >
            <span className="relative z-10">{loading ? 'BUSY' : 'EXECUTE'}</span>
            <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </form>
        <div className="mt-4 text-center">
           <span className="text-[7px] text-white/20 tracking-[1em] uppercase font-bold">Secure Neural Link Established - Likith Naidu Verified</span>
        </div>
      </div>
    </main>
  );
}
