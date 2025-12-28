"use client";
import React, { useState } from 'react';
import { useChat } from 'ai/react';

export default function PrometheusAdvanced() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <main className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      {/* Neural Link Header */}
      <header className="mb-10 text-center">
        <h1 className="text-vibrant text-6xl md:text-8xl font-black tracking-tighter">
          PROMETHEUS
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="h-[1px] w-20 bg-cyan-500"></span>
          <span className="text-cyan-400 text-xs font-bold tracking-[0.5em] uppercase">V2.0 Neural Link</span>
          <span className="h-[1px] w-20 bg-cyan-500"></span>
        </div>
      </header>

      {/* Main Command Console */}
      <div className="hologram-card w-full max-w-5xl flex flex-col md:flex-row h-[75vh]">
        
        {/* Left Stats Panel (Desktop Only) */}
        <div className="hidden md:flex w-64 border-r border-white/10 p-6 flex-col gap-6">
          <div className="space-y-2">
            <p className="text-[10px] text-purple-400 font-bold uppercase">System Integrity</p>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-cyan-500 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-pink-400 font-bold uppercase">Core Status</p>
            <p className="text-xs font-mono text-cyan-200">ACTIVE_MODE_70B</p>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20">
                <p className="text-4xl">🔱</p>
                <p className="text-sm font-bold mt-4">Awaiting Neural Input...</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-5 rounded-2xl max-w-[90%] ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(188,19,254,0.4)]' 
                  : 'bg-white/5 border border-white/10 text-cyan-100 backdrop-blur-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-6 bg-black/40 backdrop-blur-xl">
            <div className="relative group">
              <input
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-5 outline-none focus:border-cyan-500 transition-all text-white pr-20"
                placeholder="Initialize communication..."
                value={input}
                onChange={handleInputChange}
              />
              <button className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-cyan-500 to-purple-500 px-6 rounded-xl font-black text-black text-xs hover:scale-105 transition-transform">
                EXECUTE
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Floating Status UI */}
      <footer className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 font-bold animate-pulse">
           SYNC: STABLE
        </div>
        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-[10px] text-purple-400 font-bold">
           GROQ: CONNECTED
        </div>
      </footer>
    </main>
  );
}
