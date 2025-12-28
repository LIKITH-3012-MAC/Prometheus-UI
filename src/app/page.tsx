"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Command, Globe, Cpu, Zap, Activity, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PrometheusSoftware() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleExecute = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM_ERROR: Neural Link offline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#020203] flex items-center justify-center p-4 md:p-12 overflow-hidden">
      
      {/* Search Overlay FIX */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/90 backdrop-blur-xl">
             <div className="w-full max-w-xl p-4">
                <input 
                  autoFocus 
                  className="search-input w-full p-6 rounded-2xl outline-none text-xl font-mono shadow-[0_0_30px_rgba(0,242,255,0.2)]"
                  placeholder="SEARCH NEURAL INDEX..."
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                />
                <p className="mt-4 text-center text-[10px] text-cyan-500/50 tracking-[0.5em]">PRESS ESC TO EXIT</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-7xl h-full flex flex-col rounded-[2.5rem] relative z-10 overflow-hidden">
        
        {/* Header HUD */}
        <div className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <Cpu className="text-cyan-500" size={18} />
            <span className="text-[10px] font-mono tracking-[0.5em] text-white/50 uppercase">Prometheus Command Center</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="text-white/40 hover:text-cyan-400 transition-colors"><Search size={18}/></button>
            <button onClick={() => window.open('https://likith-portfolio.online/', '_blank')} className="text-white/40 hover:text-cyan-400 transition-colors"><Globe size={18}/></button>
          </div>
        </div>

        {/* Intelligence Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-24 py-10 space-y-10 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Shield size={100} strokeWidth={0.5} className="text-cyan-500 animate-pulse" />
              <p className="mt-8 text-xs font-mono tracking-[1em] text-white">SYSTEM ONLINE</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={m.role === 'user' ? 'chat-bubble-user max-w-[80%]' : 'chat-bubble-ai max-w-[80%]'}>
                <div className="text-[9px] font-mono opacity-30 mb-2 uppercase tracking-widest">{m.role}</div>
                <div className="text-sm md:text-base leading-relaxed text-slate-100">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-cyan-500 font-mono text-[10px] animate-pulse">ANALYZING...</div>}
        </div>

        {/* Input Control */}
        <div className="p-8 border-t border-white/5">
          <div className="max-w-4xl mx-auto flex items-center bg-white/[0.03] rounded-3xl p-1 border border-white/10 focus-within:border-cyan-500/50 transition-all">
            <div className="pl-6 text-cyan-900 font-mono">#</div>
            <input 
              className="flex-1 bg-transparent py-5 px-6 outline-none text-white text-sm placeholder-white/5 font-sans"
              placeholder="INITIALIZE COMMAND..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
            <button onClick={handleExecute} className="p-4 bg-cyan-600 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all">
              <Send size={20} className="text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
