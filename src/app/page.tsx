"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusAtoZ() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- AUTO SCROLL LOGIC ---
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // --- SPEECH ENGINE (TTS) ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ''));
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  };

  // --- SPEECH RECOGNITION (STT) ---
  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- CORE CHAT LOGIC ---
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
      const assistantMsg = { role: "assistant", content: data.content };
      setMessages(prev => [...prev, assistantMsg]);
      speak(data.content);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Neural Core Offline. Please check Link." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#010409] flex flex-col overflow-hidden font-sans">
      {/* 🚀 ELITE HUD HEADER */}
      <header className="shrink-0 h-24 flex justify-between items-center px-8 md:px-12 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/20">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter text-billionaire uppercase italic">Prometheus</h1>
          <p className="text-[10px] tracking-[0.5em] font-bold text-cyan-400 opacity-60">SOVEREIGN INTELLIGENCE • LIKITH NAIDU</p>
        </div>
        <div className="flex gap-4">
          <button onClick={startSTT} className={`glass px-6 py-2 text-[10px] font-black tracking-widest transition-all ${isListening ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyan-400 border-cyan-500/20'}`}>
            {isListening ? 'LISTENING...' : 'VOICE COMMAND'}
          </button>
          <div className="glass px-4 py-2 text-[10px] font-black text-zinc-500 border-white/5">V.70B</div>
        </div>
      </header>

      {/* 🌌 NEURAL STREAM (AUTO-SCROLLING) */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-6 md:px-[25%] py-12 space-y-12 scroll-smooth custom-scrollbar scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 mt-20">
             <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center shadow-2xl">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
             </div>
             <p className="text-[10px] tracking-[2em] font-black text-white uppercase text-center">Neural handshaking ready</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-500`}>
            <div className={`p-8 rounded-[35px] max-w-[95%] shadow-2xl transition-all ${m.role === 'user' ? 'chat-luxury-user' : 'billion-glass chat-luxury-ai text-zinc-100 border-white/10'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-medium"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-8 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded font-mono text-sm" {...props}>{children}</code>
                    );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-400 animate-pulse text-[10px] font-black tracking-[0.5em] uppercase px-8 italic">Synchronizing Neural Core...</div>}
      </div>

      {/* 💎 FIXED LUXURY SEARCH BAR (BOTTOM CENTER) */}
      <footer className="shrink-0 h-44 flex items-center justify-center px-6 z-50 pointer-events-none bg-gradient-to-t from-[#010409] via-[#010409] to-transparent">
        <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center">
          <div className="w-full billion-glass flex items-center p-3 rounded-[40px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] focus-within:border-cyan-500/50 transition-all duration-700 group bg-black/60 backdrop-blur-3xl">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-transparent px-10 py-6 outline-none text-white text-xl font-bold placeholder:text-zinc-800 caret-cyan-400" 
              placeholder="Inject sovereign instruction..." 
            />
            <button 
              onClick={handleSend} 
              className="bg-white text-black px-12 py-5 rounded-[30px] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-2xl mr-2"
            >
              Execute
            </button>
          </div>
          <p className="text-[7px] text-zinc-800 tracking-[2em] font-black uppercase mt-6 opacity-50">Sovereign Encryption Node Active</p>
        </div>
      </footer>
    </main>
  );
}
