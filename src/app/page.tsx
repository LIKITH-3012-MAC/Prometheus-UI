"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusOS() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- CMD+K COMMAND PALETTE ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- AUTO-SCROLL ---
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // --- TTS (BILINGUAL SUPPORT) ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // Auto-detect language for voice (basic detection)
    u.lang = /[తెలుగు]/.test(text) ? "te-IN" : "en-US";
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  // --- STT (CONTINUOUS VOICE) ---
  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handleSend = async (overrideInput?: string) => {
    const finalInput = overrideInput || input;
    if (!finalInput.trim() || loading) return;
    
    const userMsg = { role: "user", content: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], memoryContext: "User likes high-end UI design." }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      speak(data.content);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sync Error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#02040a] text-white flex flex-col overflow-hidden">
      <div className="cinematic-bg" /><div className="noise-texture" />

      {/* COMMAND PALETTE OVERLAY */}
      {showPalette && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-xl supreme-glass p-6 rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xs font-black tracking-[0.5em] uppercase opacity-50 mb-4 text-cyan-400">Command Palette</h2>
            <div className="space-y-2">
              <button onClick={() => { setMessages([]); setShowPalette(false); }} className="w-full text-left p-4 hover:bg-white/5 rounded-xl transition-all">Clear Memory</button>
              <button onClick={() => setShowPalette(false)} className="w-full text-left p-4 hover:bg-white/5 rounded-xl transition-all">Toggle Voice Mode</button>
              <button onClick={() => setShowPalette(false)} className="w-full text-left p-4 hover:bg-white/5 rounded-xl transition-all">Export Session (JSON)</button>
            </div>
            <p className="text-[8px] mt-4 opacity-30 text-center">ESC to Close</p>
          </div>
        </div>
      )}

      {/* HEADER HUD */}
      <header className="shrink-0 h-20 flex justify-between items-center px-8 z-50 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="thinking-orb" />
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-gradient">Prometheus</h1>
            <p className="text-[8px] tracking-[0.4em] font-bold text-cyan-400 opacity-60">SOVEREIGN AI • LIKITH NAIDU</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={startSTT} className={`glass px-4 py-2 text-[10px] font-black transition-all ${isListening ? 'text-red-500 animate-pulse border-red-500' : 'text-cyan-400'}`}>
             {isListening ? 'LISTENING' : 'VOICE'}
           </button>
           <button onClick={() => setShowPalette(true)} className="glass px-4 py-2 text-[10px] font-black text-white/40 opacity-100">⌘K</button>
        </div>
      </header>

      {/* NEURAL STREAM */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-[25%] py-12 space-y-12 scroll-smooth pb-48">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-700`}>
            <div className={`p-8 rounded-[32px] max-w-[95%] shadow-2xl glow-sweep ${m.role === 'user' ? 'chat-card-user' : 'supreme-glass chat-card-ai text-zinc-100'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-medium"
                components={{
                  li: ({children}) => <li className="list-disc ml-6 marker:text-cyan-400 my-2">{children}</li>,
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden border border-white/5"><SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter></div>
                    ) : ( <code className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded" {...props}>{children}</code> );
                  }
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="ai-thinking text-[10px] text-cyan-500 font-black tracking-widest px-8 uppercase animate-pulse">Syncing Reasoning Agents...</div>}
      </div>

      {/* FLOATING COMMAND DOCK */}
      <footer className="shrink-0 h-44 flex items-center justify-center px-6 z-50 pointer-events-none">
        <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center">
          <div className="w-full supreme-glass flex items-center p-3 rounded-[40px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] focus-within:border-cyan-400/50 transition-all duration-700 bg-black/60 backdrop-blur-3xl">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 bg-transparent px-10 py-6 outline-none text-white text-xl font-bold placeholder:text-zinc-800 caret-cyan-400" 
              placeholder="Inject sovereign command..." 
            />
            <button onClick={() => handleSend()} className="bg-white text-black px-12 py-5 rounded-[30px] font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl mr-2">Execute</button>
          </div>
          <p className="text-[7px] text-zinc-800 tracking-[2em] font-black uppercase mt-6 opacity-30">Multi-Agent Neural Node Active</p>
        </div>
      </footer>
    </main>
  );
}
