"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusSupremeUI() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sync interrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#010409] flex flex-col overflow-hidden">
      {/* 🚀 TOP HUD */}
      <header className="shrink-0 h-24 flex justify-between items-center px-12 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/20">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-cyan-500 rounded-full blur-[20px] absolute opacity-50 animate-pulse"></div>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-billionaire italic uppercase z-10">Prometheus</h1>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
          <p className="text-[10px] tracking-[0.6em] font-black text-white/30 hidden md:block">NEURAL ARCHITECTURE BY LIKITH NAIDU</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 rounded-full border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/5">Quantum Node Active</div>
        </div>
      </header>

      {/* 🌌 SCROLLABLE CHAT */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-[25%] py-12 space-y-12 scroll-smooth pb-48">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-40">
             <div className="w-24 h-24 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
             <p className="text-xs tracking-[1.5em] font-light text-white uppercase">Awaiting Sovereign Instruction</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in-95 duration-500`}>
            <div className={`p-8 rounded-[35px] max-w-[95%] shadow-2xl transition-all ${m.role === 'user' ? 'chat-luxury-user' : 'billion-glass chat-luxury-ai text-zinc-100'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert max-w-none text-lg leading-relaxed">
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-400 animate-pulse text-[10px] font-black tracking-[0.5em] uppercase px-8">Neural Processing...</div>}
      </div>

      {/* 💎 FIXED LUXURY SEARCH BAR (BOTTOM CENTER) */}
      <footer className="absolute bottom-0 left-0 right-0 h-44 flex items-center justify-center px-6 z-50 pointer-events-none">
        <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center">
          <div className="w-full billion-glass flex items-center p-3 rounded-[40px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] focus-within:border-cyan-500/50 transition-all duration-700 group bg-black/40">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-transparent px-10 py-6 outline-none text-white text-xl font-semibold placeholder:text-zinc-700 caret-cyan-400" 
              placeholder="Inject command into the Core..." 
            />
            <button onClick={handleSend} className="bg-white text-black px-12 py-5 rounded-[30px] font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-2xl mr-2">Execute</button>
          </div>
          <p className="text-[8px] text-white/10 tracking-[2em] font-black uppercase mt-6">Sovereign Intelligence Link</p>
        </div>
      </footer>
    </main>
  );
}
