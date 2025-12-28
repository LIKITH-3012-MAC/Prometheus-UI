"use client";
import React from 'react';
import { useChat } from 'ai/react';

export default function PrometheusNeuralLink() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="text-vibrant text-6xl md:text-9xl font-black tracking-tighter animate-pulse">
          PROMETHEUS
        </h1>
        <p className="text-[#00f3ff] text-[10px] tracking-[0.8em] mt-4 font-bold uppercase">Neural Link System V2</p>
      </header>

      <div className="glass-card w-full max-w-6xl rounded-3xl overflow-hidden flex flex-col h-[75vh] relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-5 rounded-2xl max-w-[85%] ${
                m.role === 'user' 
                ? 'bg-gradient-to-r from-[#bc13fe] to-[#7000ff] text-white shadow-lg' 
                : 'bg-white/5 border border-white/10 text-cyan-50'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/10">
          <div className="flex gap-4 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={handleInputChange}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#00f3ff] text-white"
              placeholder="Inject command..."
            />
            <button type="submit" className="bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] px-10 rounded-2xl font-black text-black text-xs hover:scale-105 transition-all">
              EXECUTE
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
