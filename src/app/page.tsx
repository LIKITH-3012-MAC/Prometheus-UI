"use client";
import React, { useState } from 'react';
import { useChat } from 'ai/react';

export default function PrometheusVibrant() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <main className="min-h-screen main-layout flex flex-col items-center">
      {/* Header with Hyper-Gradient */}
      <header className="w-full py-12 text-center animate-fade-in">
        <h1 className="header-text text-6xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff00ff] drop-shadow-[0_0_20px_rgba(0,243,255,0.5)]">
          PROMETHEUS
        </h1>
        <div className="mt-4 flex justify-center items-center gap-3">
          <div className="h-[1px] w-12 bg-[#00f3ff]"></div>
          <p className="text-[#00f3ff] text-[10px] tracking-[0.8em] font-bold uppercase">Neural Link V2</p>
          <div className="h-[1px] w-12 bg-[#ff00ff]"></div>
        </div>
      </header>

      {/* Futuristic Command Center Card */}
      <div className="chat-card glass-card w-full max-w-6xl flex flex-col md:flex-row h-[70vh] border border-white/10 shadow-2xl relative">
        
        {/* Left Side Panel - System Stats */}
        <div className="hidden md:flex w-72 border-r border-white/10 p-8 flex-col gap-8 bg-black/20">
          <div className="space-y-3">
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">System Integrity</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-[94%] bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">Neural Density</p>
            <p className="text-sm font-mono text-white">70B_ACTIVE_LLAMA</p>
          </div>
          <div className="mt-auto space-y-2">
             <div className="flex items-center gap-2 text-[10px] text-pink-500 font-bold">
               <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
               CLOUD SYNC: ACTIVE
             </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col relative bg-black/10">
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <div className="w-20 h-20 border-2 border-dashed border-cyan-500 rounded-full animate-spin-slow"></div>
                <p className="mt-6 text-sm font-bold tracking-widest text-cyan-500 uppercase">Awaiting Neural Pulse</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-6 rounded-3xl max-w-[90%] md:max-w-[80%] backdrop-blur-xl ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-br from-[#bc13fe] to-[#7000ff] text-white shadow-lg' 
                  : 'glass-card border-l-4 border-[#00f3ff] text-gray-100'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Interface */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
            <div className="relative max-w-4xl mx-auto group">
              <input
                value={input}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all text-white placeholder-white/20"
                placeholder="Initialize neural command..."
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] px-8 rounded-xl font-black text-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                EXECUTE
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
