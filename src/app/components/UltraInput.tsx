"use client";
import React, { useState, useEffect } from "react";
import { Mic, Send } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
}

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      setSpeechText(e.results[0][0].transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };
  return { listening, speechText, startListening, stopListening };
}

export default function UltraInput({ onSend }: Props) {
  const [input, setInput] = useState("");
  const { listening, speechText, startListening, stopListening } = useSpeech();

  useEffect(() => {
    if (listening) setInput(speechText);
  }, [speechText, listening]);

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[60%] flex items-center glass-strong rounded-full px-4 py-3 shadow-xl">
      {/* Mic */}
      <button
        onClick={listening ? stopListening : startListening}
        className={`mr-3 p-3 rounded-full ${listening ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`}
      >
        <Mic size={20} className="text-white"/>
      </button>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (onSend(input), setInput(""))}
        placeholder="Speak or type an ULTRA command..."
        className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-lg"
      />

      {/* Send */}
      <button
        onClick={() => { onSend(input); setInput(""); }}
        className="ml-3 p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 transition-transform"
      >
        <Send size={18} className="text-black"/>
      </button>
    </div>
  );
}
