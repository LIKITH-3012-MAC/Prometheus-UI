"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusHardLockedUI() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ''));
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

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
      speak(data.content);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Neural Link Error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#020617] flex flex-col font-sans overflow-hidden">
      {/* 1. Locked Header */}
      <header className="w-full h-20 flex justify-between items-center px-6 md:px-12 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter text-gradient uppercase italic">Prometheus</h1>
          <p className="text-[9px] tracking-[0.4em] font-bold text-cyan-400 opacity-60">NEURAL LINK • LIKITH NAIDU</p>
        </div>
        <div className="flex gap-4">
          <button onClick={startSTT} className={`glass px-5 py-2 text-[10px] font-bold tracking-widest transition-all ${isListening ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyan-400 border-cyan-500/20'}`}>
            {isListening ? 'LISTENING' : 'VOICE'}
          </button>
        </div>
      </header>

      {/* 2. Isolated Scrollable Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-[25%] py-10 space-y-10 scroll-smooth custom-scrollbar bg-radial-gradient">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
            <div className="w-16 h-16 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-cyan-500 rounded-full glow-cyan"></div>
            </div>
            <p className="text-[10px] tracking-[2em] font-black text-white uppercase text-center">Neural Sync Ready</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5`}>
            <div className={`p-6 rounded-[28px] max-w-[90%] shadow-2xl transition-all duration-300 ${m.role === 'user' ? 'chat-user glow-purple text-zinc-900 font-bold' : 'glass chat-ai text-zinc-100 border-white/10'}`}>
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
                      <code className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-500 animate-pulse text-[10px] font-black uppercase tracking-widest px-4">Processing Command...</div>}
      </div>

      {/* 3. 🔥 WORLD CLASS CENTERED BOTTOM SEARCH BAR */}
      <footer className="w-full h-32 flex items-center justify-center px-4 md:px-12 z-50 bg-gradient-to-t from-[#020617] to-transparent">
        <div className="w-full max-w-3xl glass-strong flex items-center p-2 rounded-[32px] border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all duration-500">
          <input 
            value={input} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            onChange={(e) => setInput(e.target.value)} 
            className="flex-1 bg-transparent px-8 py-5 outline-none text-white text-lg placeholder:text-zinc-600" 
            placeholder="Describe your vision or issue command..." 
          />
          <button 
            onClick={handleSend} 
            className="bg-white text-black px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Execute
          </button>
        </div>
      </footer>
    </main>
  );
}
