"use client";
import React, { useState, useEffect, useRef } from "react";

export default function PrometheusPage() {
  const [messages, setMessages] = useState<{ role: string; content: string; typing?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Speak using TTS
  const speak = (text: string) => {
    if (!ttsEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const aiMsgPlaceholder = { role: "assistant", content: "", typing: true };
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (data.content) {
        let idx = 0;
        const content = data.content;
        const interval = setInterval(() => {
          idx++;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = {
              role: "assistant",
              content: content.slice(0, idx),
              typing: idx < content.length
            };
            return newMsgs;
          });
          if (idx >= content.length) {
            clearInterval(interval);
            speak(content);
          }
        }, 20); // speed of letter-by-letter
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Voice recognition
  const startListening = () => {
    const SpeechRec: any = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return alert("Speech Recognition not supported in this browser.");
    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Floating particles
  const [particles, setParticles] = useState<Array<{id:number, top:string, left:string, size:number, color:string}>>([]);
  useEffect(() => {
    const temp: any[] = [];
    const colors = ["#00f3ff","#ff00ff","#9400ff","#00ff99","#ff9900"];
    for(let i=0;i<40;i++){
      temp.push({
        id:i,
        top: Math.random()*100 + "vh",
        left: Math.random()*100 + "vw",
        size: Math.random()*4 + 2,
        color: colors[Math.floor(Math.random()*colors.length)]
      });
    }
    setParticles(temp);
  },[]);

  return (
    <div className={darkMode ? "dark" : "light"} style={{ minHeight:"100vh", padding:20, position:"relative", overflow:"hidden", backgroundColor: darkMode ? "#050505" : "#f0f0f0", color: darkMode ? "#fff" : "#000" }}>
      
      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          position:"absolute", top:p.top, left:p.left,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, animation:`float ${3+Math.random()*5}s ease-in-out infinite alternate`
        }} />
      ))}

      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-3xl md:text-5xl font-bold animate-neon">Prometheus AI 🌌</h1>
        <button onClick={() => setDarkMode(prev => !prev)} className="px-3 py-1 border rounded hover:scale-105 transition-all">
          {darkMode ? "Day Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Chat panel */}
      <div className="panel overflow-auto h-[60vh] mb-4 border p-4 rounded flex flex-col gap-2 backdrop-blur-md bg-white/10 dark:bg-gray-900/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role==="user"?"user":"ai"} break-words relative`}>
            <strong>{msg.role==="user"?"You":"AI"}: </strong>
            <span style={{whiteSpace: "pre-line"}}>{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input + Controls */}
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-2 bg-white/20 dark:bg-gray-800/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-gradient-to-r from-cyan-400 to-pink-500 px-4 py-2 rounded text-white font-bold animate-neon hover:scale-105 transition-all">Send</button>
        <button onClick={startListening} className={`px-4 py-2 rounded ${listening?"bg-red-500":"bg-green-500"} text-white font-bold hover:scale-105 transition-all`}>
          {listening?"Listening...":"Voice"}
          {listening && <span className="voice-wave flex ml-2"><div></div><div></div><div></div></span>}
        </button>
        <button onClick={() => setTtsEnabled(prev=>!prev)} className="bg-purple-500 px-4 py-2 rounded text-white font-bold hover:scale-105 transition-all">
          {ttsEnabled?"TTS ON":"TTS OFF"}
        </button>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .voice-wave > div {
          background: #00f3ff;
          width: 4px;
          height: 6px;
          margin: 0 1px;
          border-radius: 2px;
          animation: wave 0.5s infinite alternate;
        }
        @keyframes wave {
          0% { height: 6px; }
          50% { height: 24px; }
          100% { height: 6px; }
        }
      `}</style>
    </div>
  );
}
