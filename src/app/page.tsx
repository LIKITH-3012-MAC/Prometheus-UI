"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusElite() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Time & Date for UI and Prompt
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const speak = (text: string) => {
    if (!isTts) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ''));
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  };

  const startSTT = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
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
          currentTime: `${timeString} on ${dateString}` // Injecting time into API
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content }]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* HUD Header */}
      <nav className="w-full max-w-6xl flex justify-between items-end mb-8 px-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Prometheus <span className="text-cyan-400 not-italic font-mono text-sm tracking-normal">Elite</span></h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Arch: Likith Naidu Anumakonda</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-4">
             <button onClick={() => setIsTts(!isTts)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isTts ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-white/10 text-zinc-600'}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
             </button>
             <button onClick={startSTT} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isListening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'border-white/10 text-zinc-600'}`}>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
             </button>
          </div>
          <div className="text-[9px] text-zinc-500 font-black tracking-widest uppercase">{timeString} | {dateString}</div>
        </div>
      </nav>

      {/* Main Glass Console */}
      <div className="glass-console w-full max-w-6xl flex-1 rounded-[40px] flex flex-col overflow-hidden relative shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-16 space-y-12 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
              <div className="w-4 h-4 bg-cyan-500 rounded-full pulse-dot"></div>
              <p className="text-[10px] tracking-[1.5em] font-black uppercase">Neural Handshake Ready</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
              <div className={`w-full max-w-[95%] ${m.role === 'user' ? 'bg-zinc-900/50 p-6 rounded-3xl border border-white/5 shadow-xl text-zinc-100' : ''}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert max-w-none text-sm md:text-lg leading-8"
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="my-8 rounded-2xl overflow-hidden border border-white/10">
                          <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono" {...props}>{children}</code>
                      );
                    },
                    h2: ({children}) => <h2 className="text-2xl font-bold text-white border-l-4 border-cyan-500 pl-6 my-10">{children}</h2>,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-500 animate-pulse text-[10px] font-black tracking-[0.5em] px-4 uppercase">Syncing with Core...</div>}
        </div>

        {/* Console Input */}
        <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onChange={(e) => setInput(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-10 py-6 outline-none focus:border-cyan-500/50 transition-all text-lg placeholder-zinc-700" 
              placeholder="Inject command..." 
            />
            <button onClick={handleSend} className="absolute right-4 bg-white text-black px-10 py-3 rounded-xl font-black text-xs uppercase hover:bg-cyan-500 transition-all">Execute</button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[8px] text-zinc-700 tracking-[1em] uppercase font-bold">Encrypted Neural Stream | Verified Access</p>
    </main>
  );
}
