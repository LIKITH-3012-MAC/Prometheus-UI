"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Mic } from "lucide-react";

// ---------- TTS/STT ----------
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const listen = (onResult: (text: string) => void) => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => setSpeaking(false);
  };

  return { speak, listen, speaking, setSpeaking };
}

// ---------- ULTRA INPUT ----------
interface UltraInputProps {
  onSend: (msg: string) => void;
}

export default function UltraInput({ onSend }: UltraInputProps) {
  const [input, setInput] = useState("");
  const { speak, listen, speaking, setSpeaking } = useSpeech();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    speak(input); // TTS
    setInput("");
  };

  const handleMic = () => {
    if (speaking) return;
    setSpeaking(true);
    listen((text) => {
      setInput(text);
      setSpeaking(false);
      onSend(text);
      speak(text);
    });
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
      <div className="flex items-center bg-white/5 border border-white/20 backdrop-blur-lg rounded-full px-4 py-3 shadow-xl hover:shadow-cyan-400/40 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type or speak an ULTRA command..."
          className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none px-4 py-2 text-lg"
        />
        <button
          onClick={handleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${speaking ? 'bg-cyan-500 animate-pulse' : 'bg-gradient-to-br from-purple-500 to-pink-500'}
                      hover:scale-110 transition-all mr-2`}
        >
          <Mic size={20} className="text-black"/>
        </button>
        <button
          onClick={handleSend}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-500 hover:scale-110 transition"
        >
          <Send size={20} className="text-black"/>
        </button>
      </div>
    </div>
  );
}
