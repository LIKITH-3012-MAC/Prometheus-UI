"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, Globe, Cpu, Zap, Activity, Shield } from 'lucide-react';
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
    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput(''); // Clear input
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM_ERROR: Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#020203] flex items-center justify-center p-4 md:p-10 overflow-hidden font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.03),transparent)] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel w-full max-w-7xl h-full flex flex-col rounded-[2rem] border border-white/10 relative z-10 overflow-hidden shadow-2xl">
        
        {/* Header HUD */}
        <header className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0 bg-white/[0.02] z-20">
          <div className="flex items-center gap-4 text-cyan-500/50 uppercase font-mono text-[10px] tracking-[0.4em]">
            <Cpu size={16} /> Prometheus Neural Link
          </div>
          <button onClick={() => window.open('https://likith-portfolio.online/', '_blank')} className="text-white/20 hover:text-cyan-400 transition-all">
            <Globe size={18} />
          </button>
        </header>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-10 no-scrollbar relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Shield size={80} strokeWidth={0.5} className="text-cyan-500" />
              <p className="mt-4 text-[10px] font-mono tracking-[0.8em] text-white">SYSTEM READY</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-2xl ${m.role === 'user' ? 'bg-cyan-500/10 border-r-2 border-cyan-500' : 'bg-white/5 border-l-2 border-slate-500'}`}>
                <p className="text-[10px] font-mono opacity-30 mb-2 uppercase tracking-widest">{m.role}</p>
                <div className="text-sm md:text-base text-slate-100 leading-relaxed">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-cyan-500 font-mono text-[10px] animate-pulse">ANALYZING...</div>}
        </div>

        {/* INPUT FIELD - FIXED VISIBILITY */}
        <footer className="p-8 border-t border-white/5 bg-black/40 relative z-30">
          <div className="max-w-4xl mx-auto flex items-center bg-white/[0.05] rounded-2xl border border-white/10 focus-within:border-cyan-500/50 transition-all p-2 shadow-inner">
            <span className="pl-4 pr-2 text-cyan-900 font-mono font-bold">#</span>
            <input 
              autoFocus
              className="flex-1 bg-transparent py-4 px-2 outline-none text-white text-base font-medium placeholder-slate-700 block w-full appearance-none"
              style={{ color: 'white', WebkitTextFillColor: 'white' }} // Hard-force white text
              placeholder="INITIALIZE COMMAND..."
              value={input}
              onChange={(e) => {
                console.log("Typing:", e.target.value); // Debug check
                setInput(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
            <button onClick={handleExecute} className="p-4 bg-cyan-600 rounded-xl hover:bg-cyan-400 transition-all group active:scale-95 shadow-lg">
              <Send size={18} className="text-black group-hover:rotate-12 transition-transform" />
            </button>
          </div>
          <div className="mt-3 text-center text-[8px] font-mono text-slate-700 uppercase tracking-[0.5em]">
            Neural Extension of Likith Naidu
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
