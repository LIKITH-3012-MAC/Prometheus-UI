"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Cpu, Globe, Zap, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PrometheusNeuralLink() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // TTS Logic: Prometheus Speaks
  const speakTTS = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9; // Deep, authoritative tone
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // STT Logic: User Speaks
  const startSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleExecute = async () => {
    if (!input.trim()) return;
    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      speakTTS(data.content); // Trigger Voice Response
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM_ERROR: Neural sync interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#020203] flex items-center justify-center p-4 md:p-10 overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.02),transparent)] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl h-full flex flex-col rounded-[2.5rem] border border-white/5 bg-black/40 backdrop-blur-3xl relative z-10 overflow-hidden shadow-2xl">
        
        <header className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0">
          <div className="flex items-center gap-3 text-cyan-500/50 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Cpu size={16} /> Neural Link Active
          </div>
          <button onClick={() => window.open('https://likith-portfolio.online/', '_blank')} className="text-white/20 hover:text-cyan-400 transition-all"><Globe size={18}/></button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-10 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Shield size={60} strokeWidth={0.5} className="text-cyan-500" />
              <p className="mt-4 text-[10px] font-mono tracking-[0.8em]">PROMETHEUS SECURE</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-6 rounded-2xl ${m.role === 'user' ? 'bg-cyan-500/10 border-r-2 border-cyan-500 text-right' : 'bg-white/5 border-l-2 border-slate-700 text-left'}`}>
                <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest">{m.role}</span>
                <div className="text-sm md:text-base text-slate-100 mt-2 leading-relaxed"><ReactMarkdown>{m.content}</ReactMarkdown></div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-cyan-500 font-mono text-[10px] animate-pulse ml-2 uppercase tracking-widest">Synthesizing...</div>}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/60 relative">
          {/* Waveform Animation */}
          {isListening && (
            <div className="absolute -top-10 left-0 w-full flex justify-center gap-1 items-end h-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="waveform-bar w-1 rounded-full" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto flex items-center gap-4">
            {/* Mic Button */}
            <button 
              onClick={startSTT}
              className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-cyan-500 text-black shadow-glow-active' : 'bg-white/5 text-slate-500 shadow-glow hover:bg-white/10'}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Input Bar */}
            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center p-1 focus-within:border-cyan-500/40 transition-all">
              <input 
                autoFocus
                className="flex-1 bg-transparent py-4 px-6 outline-none text-white text-base placeholder-slate-700 font-sans"
                placeholder={isListening ? "Listening to your voice..." : "Inject Command..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
              />
              <button onClick={handleExecute} className="p-4 bg-cyan-600 rounded-xl hover:bg-cyan-400 transition-all shadow-glow active:scale-95">
                <Send size={18} className="text-black" />
              </button>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
