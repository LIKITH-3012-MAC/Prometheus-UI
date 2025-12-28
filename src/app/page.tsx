"use client";
import React, { useState } from 'react';

export default function PrometheusExtraordinary() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10">
      {/* Top Status Bar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 px-4">
        <div className="flex gap-4 items-center">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400">CORE: ONLINE</span>
        </div>
        <div className="text-[10px] font-black tracking-[0.3em] text-purple-400">MEM_LOAD: 14%</div>
      </div>

      {/* Main Container */}
      <div className="neural-border w-full max-w-6xl rounded-[40px] flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-white/10 flex flex-col items-center">
          <h1 className="vibrant-gradient text-5xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
            PROMETHEUS
          </h1>
          <p className="text-white/40 text-[9px] tracking-[1em] uppercase mt-2 font-bold">Advanced Neural Architecture</p>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
              <div className="w-16 h-16 border border-cyan-500 rounded-full animate-spin"></div>
              <p className="text-xs tracking-widest font-bold">INITIALIZING LINK...</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`px-6 py-4 rounded-[24px] max-w-[85%] border backdrop-blur-md ${
                m.role === 'user' 
                ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400/30 text-white' 
                : 'bg-white/5 border-white/10 text-cyan-100'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Futuristic Input Area */}
        <form className="p-8 bg-black/60 backdrop-blur-2xl border-t border-white/5">
          <div className="relative group max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-10 py-6 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-white placeholder-white/20 font-medium"
              placeholder="Inject Neural Command..."
            />
            <button className="absolute right-4 top-4 bottom-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 px-10 rounded-2xl font-black text-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all">
              Execute
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Bottom Elements */}
      <div className="mt-10 flex gap-10 opacity-40">
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-cyan-500"></div>
        <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-pink-500"></div>
      </div>
    </main>
  );
}
