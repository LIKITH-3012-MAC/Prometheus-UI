"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrometheusUI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  return (
    <main className="main-layout min-h-screen">
      {/* Header Area */}
      <header className="w-full py-10 text-center">
        <h1 className="header-text text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff00ff] drop-shadow-[0_0_15px_rgba(188,19,254,0.5)]">
          PROMETHEUS
        </h1>
        <p className="text-[#00f3ff] tracking-[0.5em] text-xs mt-2 font-bold uppercase">Neural Link System</p>
      </header>

      {/* Main Chat Interface */}
      <div className="chat-card glass-card w-full flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-[#bc13fe] text-white' : 'glass-card border-l-4 border-[#00f3ff]'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Zone */}
        <div className="p-4 glass-card border-t border-white/10">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00f3ff] transition-all text-white placeholder-white/30"
              placeholder="Inject neural command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="neural-btn">Send</button>
          </div>
        </div>
      </div>

      {/* Feature Toggles (Placeholder for your existing logic) */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 pb-10">
        <div className="glass-card px-6 py-3 rounded-full border-[#bc13fe]/30 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
          VOICE: ACTIVE
        </div>
        <div className="glass-card px-6 py-3 rounded-full border-[#00f3ff]/30 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff00ff] animate-pulse"></span>
          STREAMS: NEURAL
        </div>
      </div>
    </main>
  );
}
