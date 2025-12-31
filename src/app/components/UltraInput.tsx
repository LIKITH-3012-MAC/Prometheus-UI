"use client";
import React, { useState, useEffect } from "react";
import { Microphone, Send } from "lucide-react";

export interface UltraInputProps {
  onSend: (message: string) => void;
}

export default function UltraInput({ onSend }: UltraInputProps) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const Rec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const rec = new Rec();
      rec.continuous = false;
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      rec.onend = () => setListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleMic = () => {
    if (!recognition) return;
    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    // TTS
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(input.trim());
      utter.lang = "en-US";
      utter.rate = 1;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    }
    setInput("");
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-2xl flex items-center gap-4 glass-strong p-4 rounded-full shadow-xl">
      <button
        onClick={toggleMic}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
          listening ? "bg-cyan-500 animate-pulse" : "bg-white/10"
        }`}
      >
        <Microphone className="text-white" />
      </button>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Speak or type your command..."
        className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30 px-4 py-3 rounded-full text-lg drop-shadow-[0_0_6px_rgba(0,246,255,0.35)]"
      />
      <button
        onClick={handleSend}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 transition"
      >
        <Send size={18} className="text-black" />
      </button>
    </div>
  );
}
