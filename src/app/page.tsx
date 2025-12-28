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
    <main className="h-screen w-screen bg-[#000] text-white flex flex-col relative overflow-hidden font-mono">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      {/* Top HUD */}
      <nav className="border-b border-cyan-500/30 p-4 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
          <h1 className="text-xl font-black tracking-tighter">PROMETHEUS <span className="text-cyan-500 text-xs uppercase">V2.1</span></h1>
        </div>
        <div className="text-[10px] text-cyan-500/60 tracking-[0.3em] font-bold">ARCHITECT: LIKITH NAIDU ANUMAKONDA</div>
      </nav>

      {/* Main Terminal Viewport */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar relative z-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
            <div className="w-20 h-20 border border-dashed border-cyan-500 rounded-full animate-spin-slow"></div>
            <p className="text-[10px] tracking-[1em] font-black">NEURAL LINK READY</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-700`}>
            <div className={`p-6 border-l-2 relative ${
              m.role === 'user' 
              ? 'bg-purple-500/5 border-purple-500/50 text-white' 
              : 'bg-cyan-500/5 border-cyan-500/50 text-cyan-50'
            }`}>
              <div className={`absolute top-0 ${m.role === 'user' ? 'right-0' : 'left-0'} w-2 h-2 bg-current opacity-50`}></div>
              <p className="text-sm md:text-base leading-relaxed tracking-wide italic">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-500 animate-pulse text-[10px] font-black uppercase">Decrypting Neural Data...</div>}
      </div>

      {/* Control Console */}
      <div className="p-6 md:p-10 border-t border-cyan-500/20 bg-black/80 backdrop-blur-2xl z-50">
        <form onSubmit={handleSend} className="max-w-6xl mx-auto flex gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-sm px-6 py-4 outline-none focus:border-cyan-500/50 transition-all text-sm tracking-widest uppercase text-white"
            placeholder="TYPE_COMMAND_HERE"
          />
          <button type="submit" className="border border-cyan-500 px-10 rounded-sm font-black text-cyan-500 text-xs uppercase hover:bg-cyan-500 hover:text-black transition-all">
            EXECUTE
          </button>
        </form>
      </div>
    </main>
  );
}
