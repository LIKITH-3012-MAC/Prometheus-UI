"use client";
import { useState, useEffect } from "react";

interface VoiceControlsProps {
  ttsEnabled: boolean;
  onText: (text: string) => void;
}

export default function VoiceControls({ ttsEnabled, onText }: VoiceControlsProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onText(text);
      if (ttsEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utter);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (typeof window !== "undefined" && (window as any).speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setListening(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded ${
          listening ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {listening ? "Listening..." : "Start Voice Input"}
      </button>
      {transcript && <p className="mt-2 text-gray-300">You said: {transcript}</p>}
      {listening && (
        <button
          onClick={stopListening}
          className="px-3 py-1 rounded bg-yellow-500 text-black mt-1"
        >
          Stop
        </button>
      )}
    </div>
  );
}
