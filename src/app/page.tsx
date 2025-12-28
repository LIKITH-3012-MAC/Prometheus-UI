"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Cpu, Globe, Zap, Shield, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PrometheusNeuralLink() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // Voice ON/OFF Toggle
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // TTS Logic: Only speaks if Voice is enabled
  const speakTTS = (text) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.85; 
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // STT Logic
  const startSTT = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");

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
      if (isVoiceEnabled) speakTTS(data.content);
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
        
        <header className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-3 text-cyan-500/50 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Cpu size={16} className="animate-pulse" /> Neural Link Established
          </div>
          <div className="flex items-center gap-4">
             {/* Voice ON/OFF Toggle */}
             <button 
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isVoiceEnabled) window.speechSynthesis.cancel();
                }}
                className={`p-2 rounded-lg transition-all ${isVoiceEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-600 bg-white/5'}`}
                title={isVoiceEnabled ? "Voice Output: ON" : "Voice Output: OFF"}
             >
                {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
             </button>
             <button onClick={() => window.open('https://likith-portfolio.online/', '_blank')} className="text-white/20 hover:text-cyan-400 transition-all border-l border-white/10 pl-4"><Globe size={18}/></button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-10 no-scrollbar relative">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Shield size={60} strokeWidth={0.5} className="text-cyan-500" />
              <p className="mt-4 text-[10px] font-mono tracking-[0.8em] uppercase">Security Level: Elite</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-6 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-cyan-500/10 border-r-2 border-cyan-500' : 'bg-white/5 border-l-2 border-slate-700'}`}>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest">{m.role}</span>
                   {m.role === 'assistant' && isVoiceEnabled && (
                     <button onClick={() => speakTTS(m.content)} className="opacity-30 hover:opacity-100 text-cyan-500"><Volume2 size={10}/></button>
                   )}
                </div>
                <div className="text-sm md:text-base text-slate-100 leading-relaxed"><ReactMarkdown>{m.content}</ReactMarkdown></div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-cyan-500 font-mono text-[10px] animate-pulse uppercase tracking-[0.2em]">Processing...</div>}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/60 relative">
          {isListening && (
            <div className="absolute -top-10 left-0 w-full flex justify-center gap-1 items-end h-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="waveform-bar w-1 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,246,255,0.5)]" style={{ height: '4px', animation: 'wave-data 0.6s infinite ease-in-out alternate', animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button 
              onClick={startSTT}
              className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-cyan-500 text-black shadow-[0_0_20px_#00f6ff]' : 'bg-white/5 text-slate-500 hover:bg-white/10 border border-white/5'}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center p-1 focus-within:border-cyan-500/40 transition-all shadow-inner">
              <input 
                autoFocus
                className="flex-1 bg-transparent py-4 px-6 outline-none text-white text-base placeholder-slate-800 font-sans block w-full"
                placeholder={isListening ? "Listening..." : "Inject Command..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
              />
              <button onClick={handleExecute} className="p-4 bg-cyan-600 rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] active:scale-95">
                <Send size={18} className="text-black" />
              </button>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
