"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrometheusSupreme() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  // Speech to Text (STT)
  const startSTT = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support STT");
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // Text to Speech (TTS)
  const triggerTTS = (text: string) => {
    window.speechSynthesis.cancel();
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.8; // Deep Tech Voice
    synth.speak(utterance);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: any) => {
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
      triggerTTS(data.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="nebula-bg"></div>
      
      <div className="w-full max-w-7xl flex flex-col h-[90vh] hologram-card rounded-[40px] overflow-hidden">
        {/* Header HUD */}
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div>
            <h1 className="text-4xl font-black tracking-tighter glow-text bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              PROMETHEUS <span className="text-xs italic opacity-50">SUPREME</span>
            </h1>
            <p className="text-[9px] tracking-[1em] text-cyan-500 uppercase font-bold mt-1">Architect: Likith Naidu Anumakonda</p>
          </div>
          <div className="flex gap-2 h-4">
             {[1,2,3,4].map(i => <div key={i} className="voice-indicator" style={{animationDelay: `${i*0.2}s`}}></div>)}
          </div>
        </header>

        {/* Neural Viewport */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <div className="w-24 h-24 border-2 border-cyan-500 rounded-full animate-ping mb-4"></div>
              <p className="text-xs tracking-[1.5em] font-black uppercase">Voice Link Active</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
              <div className={`p-6 rounded-[24px] max-w-[85%] border backdrop-blur-3xl shadow-2xl ${
                m.role === 'user' 
                ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-purple-500/20' 
                : 'bg-white/5 border-white/10 text-cyan-50'
              }`}>
                <p className="text-sm md:text-base leading-relaxed tracking-wide font-light">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-cyan-400 text-[10px] animate-pulse font-black uppercase tracking-widest">Processing Neural Signal...</div>}
        </div>

        {/* Command Input Console */}
        <div className="p-8 bg-black/40 border-t border-white/5">
          <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-4">
            <button 
              type="button"
              onClick={startSTT}
              className={`p-5 rounded-2xl border transition-all ${isListening ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-white/5 border-white/10 hover:border-cyan-500'}`}
            >
              🎤
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-cyan-500/50 transition-all text-white placeholder-white/20 font-light"
              placeholder="Inject command or speak..."
            />
            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-purple-600 px-12 rounded-2xl font-black text-black uppercase hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all">
              Execute
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
