"use client";
import React, { useState } from "react";
import { Mic, Send, MicOff } from "lucide-react";

export default function UltraInput({ onSend, isListening, onMicClick }: any) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="glass-strong flex items-center p-2 rounded-[32px] hover-glow transition-all duration-500 group w-full max-w-3xl mx-auto mb-10 z-50">
      <button 
        onClick={onMicClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'hover:bg-white/10'}`}
      >
        {isListening ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-cyan-400" />}
      </button>
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Issue an ULTRA command..."
        className="flex-1 bg-transparent px-6 py-4 outline-none text-white text-lg placeholder:text-white/20"
      />
      
      <button
        onClick={handleSend}
        className="btn btn-neon text-black text-xs uppercase tracking-widest mr-2 flex items-center gap-2"
      >
        Execute <Send size={14} />
      </button>
    </div>
  );
}
