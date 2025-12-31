"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import VoiceControls from "@/components/VoiceControls";

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  };

  const sendMessage = async (content: string) => {
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, { role: "user", content }],
      }),
    });

    const reader = res.body!.getReader();
    let aiText = "";
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      aiText += new TextDecoder().decode(value);
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1].content = aiText;
        return updated;
      });
    }

    speak(aiText);
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex justify-between p-4 border-b border-cyan-500/20">
        <h1 className="text-xl font-bold text-cyan-400">Prometheus AI</h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1 rounded border"
        >
          🌗
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="message">
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children }) {
                  if (inline) return <code>{children}</code>;
                  return (
                    <SyntaxHighlighter style={atomDark}>
                      {String(children)}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={bottomRef} />
      </section>

      <footer className="p-4 border-t border-cyan-500/20 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1 px-3 py-2 rounded bg-transparent border"
          placeholder="Ask anything..."
        />
        <VoiceControls onResult={sendMessage} />
        <button
          onClick={() => sendMessage(input)}
          className="px-4 py-2 rounded bg-cyan-500 text-black"
        >
          Send
        </button>
      </footer>
    </main>
  );
}
