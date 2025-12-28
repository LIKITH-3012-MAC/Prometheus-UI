"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';

export default function PrometheusNeuralLink() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <main className="main-layout min-h-screen">
      <header className="w-full py-12 text-center">
        <h1 className="header-text text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff00ff] animate-pulse">
          PROMETHEUS
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] mx-auto mt-4 rounded-full shadow-[0_0_20px_#00f3ff]"></div>
      </header>

      <div className="chat-card glass-card flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl backdrop-blur-md ${
                m.role === 'user' 
                ? 'bg-gradient-to-br from-[#bc13fe] to-[#7000ff] text-white shadow-[0_10px_30px_rgba(188,19,254,0.3)]' 
                : 'glass-card border-l-4 border-[#00f3ff] text-[#e0e0e0]'
              }`}>
                <p className="text-sm md:text-base leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex gap-4">
            <input
              value={input}
              onChange={handleInputChange}
              className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all text-white"
              placeholder="Inject neural thought..."
            />
            <button type="submit" className="neural-btn px-8 hover:scale-105 active:scale-95 transition-transform">
              EXECUTE
            </button>
          </div>
        </form>
      </div>

      <footer className="flex flex-wrap justify-center gap-6 mt-10 pb-10">
        <div className="glass-card px-8 py-3 rounded-2xl border-[#bc13fe]/40 text-[10px] tracking-widest font-black text-[#00f3ff]">
          CORE: ONLINE
        </div>
        <div className="glass-card px-8 py-3 rounded-2xl border-[#00f3ff]/40 text-[10px] tracking-widest font-black text-[#ff00ff]">
          NEURAL: ACTIVE
        </div>
      </footer>
    </main>
  );
}
