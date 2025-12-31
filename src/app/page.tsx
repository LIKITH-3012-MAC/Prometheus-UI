"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Send, Mic } from "lucide-react";
import Starfield from "./components/Starfield";

export default function PrometheusUltra() {
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
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]) {
          updated[lastIndex] = { ...updated[lastIndex], content: text.slice(0, i + 1) };
        }
        return updated;
      });
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(p => [...p, userMsg]);
    const currentInput = input;
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
    } catch (err) {
      console.error(err);
      setMessages(p => [...p, { role: "assistant", content: "Sync failed. Check connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden flex flex-col bg-[#020617]">
      <Starfield />
      <header className="p-6 flex justify-between items-center z-10 backdrop-blur-md border-b border-white/5">
        <h1 className="text-3xl font-black text-gradient uppercase">Prometheus ULTRA</h1>
        <div className="glass px-4 py-2 text-[10px] font-bold text-cyan-400 animate-pulse uppercase">Neural Link Online</div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-[20%] py-10 space-y-8 z-10 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
            <div className={`p-6 rounded-[24px] max-w-[95%] ${m.role === 'user' ? 'chat-user glow-purple text-white shadow-xl' : 'glass chat-ai text-zinc-100'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-8 md:px-[20%] z-20">
        <div className="glass-strong flex items-center p-2 rounded-[32px] hover-glow transition-all duration-500">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Issue an ULTRA command..." 
            className="flex-1 bg-transparent px-8 py-4 outline-none text-white text-lg placeholder:text-white/20"
          />
          <button onClick={handleSend} className="btn btn-neon text-black text-xs uppercase font-black px-8 py-3 rounded-full mr-2 transition-all hover:scale-105 active:scale-95">Execute</button>
        </div>
      </footer>
    </main>
  );
}
