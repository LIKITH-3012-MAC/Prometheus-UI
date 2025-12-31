"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusCosmicUI() {
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
    <main className="h-screen flex flex-col p-4 md:p-10 relative overflow-hidden">
      {/* Header HUD */}
      <header className="flex justify-between items-center mb-8 px-4 z-10 backdrop-blur-sm">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter text-gradient uppercase italic">Prometheus</h1>
          <p className="text-[10px] tracking-[0.4em] font-bold text-cyan-400 opacity-70">NEURAL LINK • LIKITH NAIDU</p>
        </div>
        <div className="flex gap-3">
           <button onClick={startSTT} className={`glass px-4 py-2 text-[10px] font-bold transition-all ${isListening ? 'text-red-500 animate-pulse border-red-500' : 'text-cyan-400'}`}>
             {isListening ? 'LISTENING...' : 'VOICE'}
           </button>
           <div className="glass px-4 py-2 text-[10px] font-bold text-zinc-500">V.70B</div>
        </div>
      </header>

      {/* Cosmic Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-[20%] space-y-10 scroll-smooth pb-44">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 mt-20">
             <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center ai-thinking shadow-2xl">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
             </div>
             <p className="text-[10px] tracking-[2em] font-black text-white uppercase text-center pl-[2em]">Neural handshake ready</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
            <div className={`p-6 rounded-[28px] max-w-[95%] shadow-2xl ${m.role === 'user' ? 'chat-user' : 'glass chat-ai text-zinc-100'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden border border-white/5">
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
        {loading && <div className="ai-thinking text-[10px] text-cyan-500 font-black tracking-widest px-4 uppercase">Syncing...</div>}
      </div>

      {/* 🔥 THE PERFECT CENTERED INPUT BAR */}
      <footer className="absolute bottom-10 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className="glass relative flex items-center p-2 rounded-[32px] border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 focus-within:border-cyan-500/50 group">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-transparent px-8 py-5 outline-none text-white text-lg placeholder:text-zinc-600" 
              placeholder="Inject command to Prometheus..." 
            />
            <button 
              onClick={handleSend} 
              className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Execute
            </button>
          </div>
          <p className="text-center text-[8px] text-zinc-700 tracking-[1em] font-black uppercase mt-4 opacity-50">Secure Neural Interface</p>
        </div>
      </footer>
    </main>
  );
}
