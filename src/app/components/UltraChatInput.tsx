"use client";
import React, { useState, useEffect, useRef } from "react";
import { MicWaveform } from "./Starfield";
import { Send } from "lucide-react";

export default function UltraChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Setup STT
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (!listening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
    setListening(!listening);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    // TTS
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(input);
      utter.lang = "en-US";
      utter.pitch = 1.1;
      utter.rate = 1;
      synthRef.current = utter;
      window.speechSynthesis.speak(utter);
    }
    setInput("");
  };

  // Simulate mic audio level for waveform
  useEffect(() => {
    let animation: number;
    const updateLevel = () => {
      setAudioLevel(listening ? Math.random() : 0);
      animation = requestAnimationFrame(updateLevel);
    };
    updateLevel();
    return () => cancelAnimationFrame(animation);
  }, [listening]);

  return (
    <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full md:w-[60%] z-20">
      <div className="glass-strong relative flex items-center p-4 rounded-3xl gap-3">
        
        {/* Mic Button */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            listening ? "bg-red-500 animate-pulse" : "bg-purple-500"
          }`}
        >
          🎤
        </button>

        {/* Waveform */}
        <div className="flex gap-1 items-end h-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MicWaveform key={i} audioLevel={audioLevel} />
          ))}
        </div>

        {/* Text Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Speak or type your ULTRA command…"
          className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-white/30 outline-none text-lg caret-cyan-400 drop-shadow-[0_0_6px_rgba(0,246,255,0.35)]"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-12 h-12 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-purple-500 to-pink-500
                     hover:scale-110 transition"
        >
          <Send size={18} className="text-black" />
        </button>
      </div>
    </footer>
  );
}
