"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Cpu, Shield, Terminal, Activity, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PrometheusNeuralConsole() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
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
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM_FAILURE: Neural Link Severed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center p-4 md:p-10 lg:p-16">
      <div className="neural-overlay" />
      
      {/* HUD Gauges */}
      <div className="absolute top-6 left-10 hidden xl:block">
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.4em] text-cyan-500/50">
          <Activity size={12} /> SYSTEM_LATENCY: 24MS
        </div>
      </div>

      {/* Main Software Console */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-7xl h-full flex flex-col rounded-[2.5rem] relative z-10 overflow-hidden"
      >
        <header className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <Cpu className="text-cyan-500" size={18} />
            <span className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">Prometheus Neural Interface</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#00f2ff]" />
            <span className="text-[9px] font-mono text-cyan-500/60 uppercase">Node: Active</span>
          </div>
        </header>

        {/* Intelligence Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-20 py-12 space-y-12 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
              <Shield size={80} strokeWidth={0.5} className="text-cyan-500" />
              <div className="text-center space-y-2">
                <p className="text-[10px] font-mono tracking-[1em] uppercase text-white">Neural Core Ready</p>
                <p className="text-[8px] font-mono tracking-[0.5em] text-cyan-500">Awaiting Encrypted Input</p>
              </div>
            </div>
          )}
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'text-right' : 'text-left w-full'}`}>
                  <div className="flex items-center gap-3 mb-4 opacity-30 ${m.role === 'user' ? 'justify-end' : ''}">
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-black text-slate-500 font-mono">
                      {m.role === 'user' ? '// LIKITH.QUERY' : '// PROMETHEUS.DATA'}
                    </span>
                  </div>
                  <div className={`text-sm md:text-lg leading-[2] ${m.role === 'user' ? 'text-cyan-400 font-medium' : 'text-slate-200 font-sans'}`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-center gap-3 text-cyan-600 font-mono text-[10px] tracking-[0.2em]">
               <Zap size={12} className="animate-bounce" /> ANALYZING NEURAL DATA...
            </div>
          )}
        </div>

        {/* Command Slab */}
        <footer className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center">
            
            <button 
              onClick={() => window.open('https://likith-portfolio.online/', '_blank')}
              className="group flex items-center gap-4 px-8 py-5 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-cyan-500/40 transition-all duration-500 shrink-0"
            >
              <Globe size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <div className="flex flex-col items-start">
                <span className="text-[8px] text-slate-600 uppercase tracking-widest font-bold">Identity</span>
                <span className="text-[11px] text-white font-mono uppercase">Portfolio</span>
              </div>
            </button>

            <div className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-3xl flex items-center p-1 transition-all focus-within:border-cyan-500/20 group">
               <div className="pl-8 text-cyan-950 font-mono text-lg">#</div>
               <input 
                 className="flex-1 bg-transparent py-5 px-6 outline-none text-sm md:text-base text-white placeholder-slate-800 font-sans"
                 placeholder="INJECT COMMAND..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
               />
               <button onClick={handleExecute} className="p-4 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all group-focus-within:bg-cyan-500 group-focus-within:text-black">
                 <Send size={20} />
               </button>
            </div>
          </div>
        </footer>
      </motion.div>
      <div className="mt-8 text-[9px] font-mono text-slate-800 uppercase tracking-[0.8em]">Likith Naidu Anumakonda • Neural Architecture</div>
    </div>
  );
}
