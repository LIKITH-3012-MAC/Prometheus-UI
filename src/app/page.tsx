"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusVibgyor() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const typeMessage = (text: string) => {
    let i = 0;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: text.slice(0, i + 1) };
        return updated;
      });
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  const handleSend = async () => {
    if (!input || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      typeMessage(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col p-4 md:p-10 relative overflow-hidden">
      {/* Header HUD */}
      <header className="flex justify-between items-center mb-8 px-4 z-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter text-gradient uppercase">Prometheus</h1>
          <p className="text-[10px] tracking-[0.4em] font-bold text-cyan-400 opacity-70">NEURAL LINK • LIKITH NAIDU</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="glass px-4 py-2 text-[10px] font-bold text-cyan-400 animate-pulse">SYSTEM: ONLINE</div>
        </div>
      </header>

      {/* Cosmic Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-[20%] space-y-8 scroll-smooth pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
             <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center ai-thinking shadow-2xl shadow-cyan-500/20">
                <div className="w-4 h-4 bg-cyan-500 rounded-full glow-cyan"></div>
             </div>
             <p className="text-[10px] tracking-[2em] font-black text-white/20 uppercase">Awaiting Command</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
            <div className={`p-6 rounded-[24px] max-w-[95%] ${m.role === 'user' ? 'chat-user glow-purple' : 'glass chat-ai'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="ai-thinking text-[10px] text-cyan-500 font-black tracking-widest px-4">SYNCING NEURAL NETWORK...</div>}
      </div>

      {/* Perla Logic Input */}
      <footer className="absolute bottom-10 left-0 right-0 px-4 md:px-[20%] z-20">
        <div className="glass-strong relative flex items-center p-2 rounded-[32px] hover-glow transition-all duration-500 group">
          <input 
            value={input} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            onChange={(e) => setInput(e.target.value)} 
            className="flex-1 bg-transparent px-8 py-5 outline-none text-white text-lg placeholder:text-white/20" 
            placeholder="Describe your vision or ask for code..." 
          />
          <button onClick={handleSend} className="btn btn-neon text-black text-xs uppercase tracking-tighter mr-2">Execute</button>
        </div>
      </footer>
    </main>
  );
}
