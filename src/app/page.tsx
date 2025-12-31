"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import VoiceControls from "@/components/VoiceControls";

export default function PrometheusPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMsg = { role: "user", content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg] }),
      });

      const data = await res.json();
      const aiText = data.content || "⚠️ No response";
      setMessages(prev => [...prev, { role: "ai", content: aiText }]);

      // Dispatch AI response for TTS
      window.dispatchEvent(new CustomEvent("ai-response", { detail: aiText }));
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", content: "⚠️ Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-4 bg-[#010409] text-[#e6e6ff]">
      <header className="text-xl sm:text-2xl font-bold text-center sm:text-left">PROMETHEUS 🌌</header>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-2 sm:p-0">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-full sm:max-w-xl break-words ${
              m.role === "user" ? "bg-cyan-900 self-end" : "bg-gray-800 self-start"
            }`}
          >
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is thinking...</div>}
      </div>

      <footer className="flex flex-col sm:flex-row gap-2 items-center">
        <VoiceControls
          onVoiceResult={sendMessage}
          ttsEnabled={ttsEnabled}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white w-full sm:w-auto"
        />
        <button
          onClick={() => sendMessage(input)}
          className="px-4 py-2 rounded bg-cyan-500 text-black w-full sm:w-auto"
        >
          Send
        </button>
        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className={`px-3 py-1 rounded text-black w-full sm:w-auto ${ttsEnabled ? "bg-green-400" : "bg-red-400"}`}
        >
          {ttsEnabled ? "TTS On" : "TTS Off"}
        </button>
      </footer>
    </div>
  );
}
