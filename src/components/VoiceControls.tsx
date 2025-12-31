"use client";
import { useState } from "react";

export default function VoiceControls({ onResult }: { onResult: (t: string) => void }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (e: any) => {
      onResult(e.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  return (
    <button
      onClick={startListening}
      className="px-3 py-1 rounded bg-cyan-500 text-black text-sm"
    >
      {listening ? "Listening..." : "🎤 Voice"}
    </button>
  );
}
