"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- Typing Sound Utility ---
const playTypingSound = () => {
  const audio = new Audio("/sounds/typing.mp3"); // add a typing mp3 in public/sounds
  audio.volume = 0.08;
  audio.play().catch(()=>{});
};

export default function PrometheusNeuralLiquidStream() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTts, setIsTts] = useState(true);
  const [isStt, setIsStt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  // --- STT Initialization ---
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend();
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleStt = () => {
    if(!recognitionRef.current) return;
    if(isStt) recognitionRef.current.stop();
    else recognitionRef.current.start();
    setIsStt(!isStt);
  };

  // --- Liquid Neon Typing Effect ---
  const typeMessage = (text:string, callback?:()=>void) => {
    let i = 0;
    setMessages(prev=>[...prev,{role:"assistant",content:""}]);
    const interval = setInterval(()=>{
      setMessages(prev=>{
        const updated = [...prev];
        const lastIndex = updated.length-1;
        if(updated[lastIndex].role==="assistant"){
          updated[lastIndex]={...updated[lastIndex],content:text.slice(0,i+1)};
        }
        return updated;
      });
      playTypingSound();
      i++;
      if(i>=text.length){
        clearInterval(interval);
        if(callback) callback();
      }
    },8);
  };

  const speak = (text:string)=>{
    if(!isTts || text.includes('![')) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*🔹📌⚠️•]/g,''));
    u.rate = 1.15; u.pitch=1.1;
    window.speechSynthesis.speak(u);
  };

  const handleSend = async ()=>{
    if(!input||loading) return;
    const userMsg={role:"user",content:input};
    setMessages(p=>[...p,userMsg]);
    setInput(""); setLoading(true);
    try{
      const res = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[...messages,userMsg],currentTime:`${timeString} on ${dateString}`}),
      });
      const data = await res.json();
      typeMessage(data.content,()=>speak(data.content));
    } finally{ setLoading(false); }
  };

  return (
    <main className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-black via-[#050505] to-[#0c0c0c] font-sans text-white">

      {/* --- Neon Particles --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(120)].map((_,i)=>(
          <div key={i} className="absolute w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-40 animate-neural-float" style={{top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,animationDelay:`${Math.random()*6}s`}}></div>
        ))}
      </div>

      {/* --- Top Nav --- */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-end p-4 md:px-8 relative z-20">
        <div>
          <h1 className="text-5xl font-extrabold italic tracking-tight drop-shadow-2xl">Prometheus <span className="text-cyan-400 font-mono text-sm not-italic underline decoration-cyan-500/70">LIQUID</span></h1>
          <p className="text-[10px] mt-1 font-bold tracking-widest uppercase text-zinc-400 drop-shadow-lg">Neon Neural Console | Likith Naidu</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <button onClick={()=>setIsTts(!isTts)} className={`px-5 py-1 rounded-full font-black text-[10px] border transition-transform ${isTts?'bg-cyan-500 text-black border-cyan-500 hover:scale-110':'border-white/20 text-zinc-400 hover:scale-110'}`}>TTS {isTts?'ON':'OFF'}</button>
          <button onClick={toggleStt} className={`px-5 py-1 rounded-full font-black text-[10px] border transition-transform ${isStt?'bg-emerald-500 text-black border-emerald-500 hover:scale-110':'border-white/20 text-zinc-400 hover:scale-110'}`}>STT {isStt?'ON':'OFF'}</button>
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 drop-shadow-lg">{timeString}</div>
        </div>
      </nav>

      {/* --- Glass Neon Console --- */}
      <div className="glass-console max-w-7xl w-full flex-1 mx-auto mt-6 rounded-[60px] flex flex-col overflow-hidden relative z-10 shadow-2xl border border-white/5 bg-white/5 backdrop-blur-3xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-16 space-y-16 scroll-smooth">
          {messages.length===0&&(
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
              <p className="text-[10px] tracking-[2em] font-black uppercase text-white drop-shadow-lg">Interface Ready</p>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
              <div className={`w-full max-w-[95%] p-6 rounded-3xl border shadow-2xl ${m.role==='user'?'bg-zinc-900/60 border-white/10 text-zinc-200 ml-12':'bg-cyan-900/10 border-cyan-500/30 text-white shadow-neon-glow shadow-neon-liquid'}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert max-w-none text-sm md:text-lg leading-8 neon-liquid-text"
                  components={{
                    img:({src,alt})=><img src={src} alt={alt} className="my-12 rounded-3xl border border-white/10 shadow-2xl" />,
                    code({node,inline,className,children,...props}:any){
                      const match = /language-(\w+)/.exec(className||'');
                      return !inline&&match?(
                        <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                          <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/,'')}</SyntaxHighlighter>
                        </div>
                      ):(
                        <code className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded font-mono" {...props}>{children}</code>
                      );
                    },
                  }}
                >{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading&&<div className="text-cyan-500 animate-pulse text-[10px] font-black tracking-[0.5em] px-4 uppercase">Neural Processing...</div>}
        </div>

        {/* --- Input --- */}
        <div className="p-8 bg-black/40 border-t border-white/10 relative">
          <div className="max-w-5xl mx-auto flex items-center relative">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} 
              className="w-full bg-white/5 border border-white/20 rounded-3xl px-12 py-6 outline-none focus:border-cyan-500/50 transition-all text-lg placeholder:text-zinc-400 shadow-inner" placeholder="Inject command..." />
            <button onClick={handleSend} className="absolute right-6 bg-white text-black px-12 py-3 rounded-xl font-black uppercase hover:bg-cyan-500 hover:text-black transition-all shadow-neon-glow shadow-neon-liquid">Execute</button>
          </div>
        </div>
      </div>

      {/* --- Neon Liquid Animations --- */}
      <style jsx>{`
        @keyframes neural-float {
          0%{transform:translateY(0) translateX(0);opacity:0.2;}
          50%{transform:translateY(-15px) translateX(10px);opacity:0.6;}
          100%{transform:translateY(0) translateX(0);opacity:0.2;}
        }
        .animate-neural-float{animation:neural-float 7s ease-in-out infinite;}
        .shadow-neon-glow{box-shadow:0 0 12px cyan,0 0 24px cyan/50%;}
        .shadow-neon-liquid{box-shadow:0 0 24px #0ff,0 0 48px #0ff/50%,0 0 72px #0ff/30%;}
        .neon-liquid-text{
          text-shadow: 0 0 2px cyan,0 0 4px cyan,0 0 6px cyan;
        }
      `}</style>
    </main>
  );
}
