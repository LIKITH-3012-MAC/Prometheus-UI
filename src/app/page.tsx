"use client";
import React, { useState } from 'react';

export default function PrometheusUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content || 'Neural link active.' }]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="text-vibrant text-6xl md:text-9xl font-black tracking-tighter">
          PROMETHEUS
        </h1>
        <p className="text-[#00f3ff] text-[10px] tracking-[0.8em] mt-4 font-bold">Neural Link System V2</p>
      </header>

      <div className="glass-card w-full max-w-6xl rounded-3xl overflow-hidden flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-[#bc13fe]' : 'bg-white/10'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/10">
          <div className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white"
              placeholder="Inject command..."
            />
            <button type="submit" className="bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] px-10 rounded-2xl font-black text-black uppercase">
              Execute
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
