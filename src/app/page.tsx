"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusNeuralStream() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- Neural Typing Effect ---
  const typeMessage = (text: string, callback?: () => void) => {
    let i = 0;
    // Initial placeholder for assistant
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === "assistant") {
          updated[lastIndex] = { ...updated[lastIndex], content: text.slice(0, i + 1) };
        }
        return updated;
      });
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 10); // Ultra-fast neural typing
  };

  const speak = (text: string) => {
    if (!isTts || text.includes('![')) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ''));
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
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
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          currentTime: `${timeString} on ${dateString}`
        }),
      });
      const data = await res.json();
      
      // Start Neural Typing instead of direct setting
      typeMessage(data.content, () => {
        speak(data.content); // Speak only after typing starts or completes
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center p-4 md:p-8 relative bg-[#050505]">
      <nav className="w-full max-w-6xl flex justify-between items-end mb-8 px-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Prometheus <span className="text-cyan-400 not-italic font-mono text-sm underline decoration-cyan-500/50">STREAM</span></h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Typing Logic V2.0 | Likith Naidu</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <button onClick={() => setIsTts(!isTts)} className={`px-4 py-1 rounded-full text-[10px] font-black border ${isTts ? 'bg-cyan-500 text-black border-cyan-500' : 'border-white/10 text-zinc-600'}`}>TTS {isTts ? 'ACTIVE' : 'OFF'}</button>
           <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{timeString}</div>
        </div>
      </nav>

      <div className="glass-console w-full max-w-6xl flex-1 rounded-[40px] flex flex-col overflow-hidden relative shadow-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-16 space-y-12 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
              <p className="text-[9px] tracking-[1.5em] font-black uppercase text-white">Interface Ready</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
              <div className={`w-full max-w-[95%] ${m.role === 'user' ? 'bg-zinc-900/50 p-6 rounded-3xl border border-white/5 text-zinc-200 ml-10' : ''}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert max-w-none text-sm md:text-lg leading-8"
                  components={{
                    img: ({src, alt}) => <img src={src} alt={alt} className="my-10 rounded-3xl border border-white/10 shadow-2xl" />,
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                          <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono" {...props}>{children}</code>
                      );
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-500 animate-pulse text-[10px] font-black tracking-[0.5em] px-4 uppercase">Neural Processing...</div>}
        </div>

        <div className="p-8 bg-black/40 border-t border-white/5">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-10 py-6 outline-none focus:border-cyan-500/50 transition-all text-lg" 
              placeholder="Inject command..." 
            />
            <button onClick={handleSend} className="absolute right-4 bg-white text-black px-10 py-3 rounded-xl font-black text-xs uppercase hover:bg-cyan-500 transition-all">Execute</button>
          </div>
        </div>
      </div>
    </main>
  );
}
