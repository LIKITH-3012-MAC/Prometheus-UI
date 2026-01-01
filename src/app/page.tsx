"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusCinematic() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      setMessages(prev => [...prev, { role: "assistant", content: "Neural Interface Error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden">
      <div className="cinematic-bg" />
      <div className="noise-texture" />

      {/* 🚀 TOP HUD HEADER */}
      <header className="shrink-0 h-20 flex justify-between items-center px-8 md:px-16 z-50 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="thinking-orb" />
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Prometheus</h1>
          <span className="hidden md:block text-[8px] tracking-[0.6em] text-zinc-500 font-black pl-4">Sovereign Intelligence Unit</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end opacity-40">
             <span className="text-[8px] font-black uppercase tracking-widest text-white">Interface Status</span>
             <span className="text-[8px] font-bold text-cyan-400 uppercase">Synchronized</span>
          </div>
          <button className="text-white opacity-40 hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </header>

      {/* 🌌 NEURAL STREAM */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-[22%] py-12 space-y-12 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30 mt-20">
             <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse"></div>
             <p className="text-[9px] tracking-[2em] font-black text-white uppercase ml-[2em]">Awaiting Command</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
            <div className={`p-8 rounded-[32px] max-w-[95%] shadow-2xl transition-all duration-500 glow-sweep ${m.role === 'user' ? 'chat-card-user' : 'supreme-glass chat-card-ai text-zinc-100 border-white/5'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-medium"
                components={{
                  li: ({children}) => <li className="list-disc ml-6 marker:text-cyan-400 my-3">{children}</li>,
                  ul: ({children}) => <ul className="my-6 space-y-3">{children}</ul>,
                  p: ({children}) => <p className="mb-6 last:mb-0">{children}</p>,
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-3xl">
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded font-mono text-sm" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-400 animate-pulse text-[9px] font-black tracking-[0.8em] uppercase px-8 py-4 italic">Neural Processing...</div>}
      </div>

      {/* 💎 FLOATING COMMAND DOCK (BOTTOM CENTER) */}
      <footer className="shrink-0 h-48 flex items-center justify-center px-6 z-50 pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto flex flex-col items-center gap-4">
          <div className="w-full supreme-glass flex items-center p-3 rounded-[40px] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)] focus-within:border-cyan-500/40 transition-all duration-700 group bg-black/40 backdrop-blur-3xl">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-transparent px-8 py-6 outline-none text-white text-xl font-medium placeholder:text-zinc-800 caret-cyan-400" 
              placeholder="Inject sovereign instruction..." 
            />
            <button 
              onClick={handleSend} 
              className="bg-white text-black px-12 py-5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-2xl mr-2"
            >
              Execute
            </button>
          </div>
          <div className="flex items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <p className="text-[7px] text-white tracking-[1.5em] font-black uppercase">Secure Neural Encryption Node</p>
             <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
