"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusV4() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const speak = (text: string) => {
    if (!isTts) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g, ''));
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
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content }]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#e3e3e3] flex flex-col font-sans">
      <nav className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter text-white uppercase">Prometheus <span className="text-cyan-500 text-[10px]">V4.0</span></h1>
        <button onClick={() => setIsTts(!isTts)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${isTts ? 'bg-cyan-500 text-black' : 'border-white/10 text-zinc-500'}`}>TTS {isTts ? 'ON' : 'OFF'}</button>
      </nav>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-10 md:px-[22%] space-y-8 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[100%] ${m.role === 'user' ? 'bg-[#1a1a1a] px-6 py-3 rounded-2xl border border-white/5' : 'w-full'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert max-w-none text-sm md:text-base leading-7"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-6 rounded-xl overflow-hidden shadow-2xl border border-white/5">
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono" {...props}>{children}</code>
                    );
                  },
                  h2: ({children}) => <h2 className="text-xl font-bold text-white mt-8 mb-4">{children}</h2>,
                  p: ({children}) => <p className="mb-4 text-[#cccccc]">{children}</p>,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-500 animate-pulse text-[10px] font-black uppercase tracking-widest">Generating Link...</div>}
      </div>

      <footer className="p-6 md:px-[22%] bg-[#0d0d0d]">
        <div className="relative flex items-center bg-[#1a1a1a] border border-white/10 rounded-[30px] px-6 py-1 focus-within:border-cyan-500/50 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Prometheus..."
            className="flex-1 bg-transparent py-4 outline-none text-base placeholder:text-zinc-700"
          />
          <button onClick={handleSend} className="bg-white text-black px-6 py-2 rounded-2xl font-black text-[10px] uppercase">Execute</button>
        </div>
        <p className="text-center text-[8px] text-zinc-700 mt-4 uppercase tracking-[0.5em] font-bold">Neural Link Engine | Likith Naidu</p>
      </footer>
    </main>
  );
}
