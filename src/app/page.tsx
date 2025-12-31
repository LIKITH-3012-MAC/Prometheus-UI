"use client";
import React, { useState, useRef, useEffect } from "react";

export default function PrometheusYesterday() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Neural Link Failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-black text-white flex flex-col p-4 md:p-10 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-500">PROMETHEUS RESTORED</h1>
        <p className="text-xs opacity-50 font-mono">Architecture: Likith Naidu</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 mb-20 px-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-xl ${m.role === 'user' ? 'bg-zinc-800' : 'bg-cyan-900/20 border border-cyan-500/20'}`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-500 animate-pulse text-xs">Thinking...</div>}
      </div>

      <footer className="fixed bottom-10 left-0 right-0 px-4 md:px-10">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your command..."
            className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-6 py-4 outline-none focus:border-cyan-500 transition-all"
          />
          <button onClick={handleSend} className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-cyan-500 transition-all">Send</button>
        </div>
      </footer>
    </main>
  );
}
