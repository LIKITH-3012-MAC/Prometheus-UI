"use client";
import { useEffect, useRef, useState } from "react";

export default function VoiceControl({ onResult }: { onResult: (t:string)=>void }) {
  const recogRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const r = new (window as any).webkitSpeechRecognition();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e:any) => {
      const t = Array.from(e.results).map((r:any)=>r[0].transcript).join("");
      onResult(t);
    };
    recogRef.current = r;
  }, []);

  const toggle = () => {
    if (!recogRef.current) return;
    listening ? recogRef.current.stop() : recogRef.current.start();
    setListening(!listening);
  };

  return (
    <button
      onClick={toggle}
      className={`w-12 h-12 rounded-full bg-black text-cyan-400 border border-cyan-400/40 ${listening ? "voice-active" : ""}`}
      title="Voice Input"
    >
      🎙️
    </button>
  );
}
