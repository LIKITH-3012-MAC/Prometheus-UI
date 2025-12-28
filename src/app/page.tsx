"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrometheusProduct() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  // Text-to-Speech Logic
  const speak = (text) => {
    if (!isTtsEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text Logic
  const startSTT = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      speak(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center bg-[#050505] p-4 md:p-8">
      {/* Top Professional Header */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Prometheus <span className="text-cyan-500">v3.0</span></h1>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em]">Developed by Likith Naidu</p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
          <button 
            onClick={() => setIsTtsEnabled(!isTtsEnabled)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${isTtsEnabled ? 'bg-cyan-500 text-black' : 'text-zinc-500'}`}
          >
            TTS {isTtsEnabled ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={startSTT}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500'}`}
          >
            {isListening ? 'LISTENING' : 'VOICE'}
          </button>
        </div>
      </nav>

      {/* Main Product Interface */}
      <div className="glass-panel w-full max-w-6xl h-full rounded-2xl flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <p className="text-sm font-medium tracking-widest uppercase">System Ready</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
              <div className={`max-w-[80%] p-5 rounded-xl text-sm md:text-base leading-relaxed ${
                m.role === 'user' ? 'bg-cyan-500 text-black font-medium' : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-500 text-[10px] font-bold animate-pulse tracking-widest">PROCESSING...</div>}
        </div>

        {/* Flat Input Bar */}
        <form onSubmit={handleSend} className="p-6 bg-zinc-900/30 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 neural-input rounded-xl px-6 py-4 text-sm md:text-base"
              placeholder="Send a command..."
            />
            <button type="submit" className="bg-white text-black px-8 rounded-xl font-bold text-xs uppercase hover:bg-cyan-500 transition-colors">
              Execute
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-6 text-[9px] text-zinc-600 font-medium tracking-[0.2em] uppercase">
        © 2025 Likith Naidu Anumakonda • AI Protocol Architecture
      </footer>
    </main>
  );
}
