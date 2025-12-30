"use client";
import React, { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PrometheusGeminiUI() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e] text-[#e3e3e3] font-sans">
      {/* Header */}
      <nav className="p-5 border-b border-white/5 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20"></div>
          <h1 className="text-xl font-bold tracking-tight">PROMETHEUS <span className="text-xs text-cyan-500 font-mono opacity-50">PRO</span></h1>
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <img src={session.user?.image || ""} className="w-8 h-8 rounded-full border border-white/10" />
            <button onClick={() => signOut()} className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100">Sign Out</button>
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold transition-transform hover:scale-105">Login</button>
        )}
      </nav>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 md:px-[20%] space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 pt-20">
            <h2 className="text-4xl font-medium bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">Hello, Likith</h2>
            <p className="text-zinc-500 text-sm">How can I assist your enterprise project today?</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] p-2 rounded-2xl ${m.role === 'user' ? 'bg-[#1e1e1e] border border-white/10 px-6 py-3' : 'w-full'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert prose-sm max-w-none leading-relaxed"
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative group my-4">
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigator.clipboard.writeText(String(children))} className="bg-white/10 hover:bg-white/20 p-1.5 rounded text-[10px]">Copy</button>
                        </div>
                        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400 font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-2 text-white">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold mt-5 mb-2 text-cyan-400">{children}</h2>,
                  li: ({children}) => <li className="mb-1 text-zinc-300 ml-4 list-disc">{children}</li>,
                  p: ({children}) => <p className="mb-4 text-zinc-300 leading-7">{children}</p>,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-cyan-500 animate-pulse text-xs font-mono px-[20%]">Prometheus is thinking...</div>}
      </div>

      {/* Input Field */}
      <footer className="p-6 md:px-[20%]">
        <div className="relative flex items-center bg-[#1e1e1e] border border-white/10 rounded-[32px] px-6 py-2 shadow-2xl focus-within:border-cyan-500/50 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Prometheus anything..."
            className="flex-1 bg-transparent py-4 outline-none text-base placeholder:text-zinc-600"
          />
          <button onClick={sendMessage} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <svg className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-4">Prometheus can make mistakes. Verify important info. Built by Likith Naidu.</p>
      </footer>
    </div>
  );
}
