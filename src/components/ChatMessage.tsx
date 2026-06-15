import { defineComponent, ref } from "vue";
import { marked } from "marked";
import CodeBlockRenderer from "./CodeBlockRenderer";
import { Volume2, VolumeX, Copy, Check, ChevronRight, FileText, Image as ImageIcon, FileArchive, Code as CodeIcon, Database as DatabaseIcon } from "lucide-vue-next";

export default defineComponent({
  name: "ChatMessage",
  props: {
    message: { type: Object, required: true },
    onCodeAction: { type: Function, required: true },
    onSelectFileOption: { type: Function, required: false },
  },
  setup(props) {
    const copied = ref(false);
    const speaking = ref(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(props.message.content);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
      } catch (err) {
        console.error(err);
      }
    };

    const handleSpeak = () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      if (speaking.value) {
        window.speechSynthesis.cancel();
        speaking.value = false;
        return;
      }

      const text = props.message.content;
      const utterance = new SpeechSynthesisUtterance(text);

      const hasTelugu = /[\u0c00-\u0c7f]/.test(text);
      utterance.lang = hasTelugu ? "te-IN" : "en-US";
      utterance.rate = 0.95;
      utterance.volume = 1.0;

      // Apply Voice Personalization
      const voicePref = localStorage.getItem("prometheus_voice_pref") || "skip";
      const userName = localStorage.getItem("prometheus_user_name") || "Commander";

      if (voicePref !== "skip") {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          let targetGender: "male" | "female" | "any" = "any";
          if (voicePref === "male") {
            targetGender = "male";
          } else if (voicePref === "female") {
            targetGender = "female";
          } else if (voicePref === "auto") {
            const lowerName = userName.toLowerCase().trim();
            const isFeminine = /(a|i|ee|ya|u|shri|priya|devi)$/.test(lowerName) && !/(indra|chandra|surya|krishna|rama|anil|amit|likith|naidu|kumar)$/.test(lowerName);
            targetGender = isFeminine ? "female" : "male";
          }

          let langVoices = voices.filter(v => 
            v.lang.toLowerCase().replace("_", "-").startsWith(hasTelugu ? "te" : "en")
          );
          if (langVoices.length === 0) {
            langVoices = voices.filter(v => v.lang.toLowerCase().replace("_", "-").startsWith("en"));
          }
          if (langVoices.length === 0) {
            langVoices = voices;
          }

          const femaleKeywords = ["zira", "hazel", "heera", "samantha", "victoria", "karen", "moira", "tessa", "veena", "susan", "female", "woman", "girl"];
          const maleKeywords = ["david", "george", "ravi", "mark", "male", "man", "boy", "guy"];

          let matchedVoice = null;
          if (targetGender === "female") {
            matchedVoice = langVoices.find(v => femaleKeywords.some(kw => v.name.toLowerCase().includes(kw)));
            utterance.pitch = 1.1;
          } else if (targetGender === "male") {
            matchedVoice = langVoices.find(v => maleKeywords.some(kw => v.name.toLowerCase().includes(kw)));
            utterance.pitch = 0.9;
          }

          if (matchedVoice) {
            utterance.voice = matchedVoice;
          } else {
            const premium = langVoices.find(v => 
              v.name.toLowerCase().includes("google") || 
              v.name.toLowerCase().includes("microsoft") || 
              v.name.toLowerCase().includes("apple")
            );
            utterance.voice = premium || langVoices[0] || null;
            utterance.pitch = 1.0;
          }
        }
      } else {
        utterance.pitch = 1.0;
      }

      utterance.onend = () => (speaking.value = false);
      utterance.onerror = () => (speaking.value = false);

      speaking.value = true;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    const parseMarkdown = (text: string) => {
      return marked.parse(text) as string;
    };

    const formatBytes = (bytes: number) => {
      if (!bytes) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
      if (!mimeType) return FileText;
      if (mimeType.startsWith("image/")) return ImageIcon;
      if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar")) return FileArchive;
      if (mimeType.includes("json") || mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("python") || mimeType.includes("java") || mimeType.includes("sql")) return CodeIcon;
      if (mimeType.includes("csv")) return DatabaseIcon;
      return FileText;
    };

    const renderMessageContent = () => {
      const text = props.message.content;
      const regex = /```(\w*)\n([\s\S]*?)```/g;
      const elements: any[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          elements.push(
            <div
              class="markdown-content text-zinc-300 leading-relaxed text-[15px] md:text-[16px]"
              v-html={parseMarkdown(textBefore)}
            />
          );
        }

        const language = match[1] || "javascript";
        const code = match[2];
        elements.push(
          <CodeBlockRenderer
            language={language}
            value={code}
            onAction={props.onCodeAction}
          />
        );

        lastIndex = regex.lastIndex;
      }

      const textAfter = text.substring(lastIndex);
      if (textAfter.trim() || elements.length === 0) {
        elements.push(
          <div
            class="markdown-content text-zinc-300 leading-relaxed text-[15px] md:text-[16px]"
            v-html={parseMarkdown(textAfter || text)}
          />
        );
      }

      return elements;
    };

    const isUser = props.message.role === "user";

    const fileOptions = [
      { id: "summary", label: "Summary" },
      { id: "indepth", label: "In-depth" },
      { id: "shorter", label: "Shorter" },
      { id: "telish", label: "Telugu-English" },
      { id: "notes", label: "Notes" },
      { id: "interview", label: "Interview Q&A" },
      { id: "key_points", label: "Key Points" },
      { id: "debug", label: "Debug Code" },
      { id: "analyze", label: "Analyze Data" },
      { id: "beginner", label: "Explain Like Beginner" },
    ];

    return () => (
      <div
        class={`flex w-full ${
          isUser ? "justify-end" : "justify-start"
        } animate-in fade-in duration-300`}
      >
        <div
          class={`relative max-w-[95%] md:max-w-[75%] p-4 md:p-8 rounded-[24px] shadow-2xl transition-all duration-300 ${
            isUser
              ? "bg-blue-950/20 text-white border border-blue-500/20 shadow-[0_0_20px_rgba(0,102,255,0.06)] ml-4 md:ml-12"
              : "glass-panel border-l-[3px] border-l-blue-500 mr-4 md:mr-12 text-zinc-100"
          }`}
        >
          {/* Controls Bar for Assistant */}
          {!isUser && (
            <div className="absolute top-4 right-4 flex items-center gap-2 select-none z-20">
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all cursor-pointer ${
                  speaking.value ? "text-blue-400 border-blue-500/20" : "text-zinc-500"
                }`}
                title={speaking.value ? "Stop Audio" : "Voice Output"}
              >
                {speaking.value ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all text-zinc-500 cursor-pointer"
                title="Copy Transcript"
              >
                {copied.value ? (
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Identity Tag */}
          <div className="flex items-center gap-2 mb-3 select-none">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isUser ? "bg-blue-400 animate-pulse" : "bg-blue-600"
              }`}
            />
            <span
              className={`text-[9px] font-black uppercase tracking-widest font-orbitron ${
                isUser ? "text-blue-400" : "text-blue-400"
              }`}
            >
              {isUser ? "Sovereign Link" : "Prometheus OS"}
            </span>
          </div>

          {/* File Card Rendering if present */}
          {props.message.file && (
            <div className="mb-4 p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/20 flex items-center gap-3.5 w-full max-w-full sm:max-w-sm select-none font-orbitron">
              <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-500/20 text-blue-400">
                {(() => {
                  const FileIcon = getFileIcon(props.message.file.type);
                  return <FileIcon className="w-5 h-5" />;
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {props.message.file.name}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5 font-mono-tech">
                  {formatBytes(props.message.file.size)}
                </div>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="space-y-4">
            {renderMessageContent()}
          </div>

          {/* Special File Options Buttons (AI File Prompt Only) */}
          {props.message.filePrompt && props.onSelectFileOption && (
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/5 select-none font-orbitron">
              {fileOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => props.onSelectFileOption!(opt.id, props.message.file)}
                  className="px-4 py-2.5 md:px-3.5 md:py-1.5 rounded-xl border border-blue-500/20 bg-blue-950/10 hover:bg-blue-500/10 hover:border-blue-500/40 text-[10px] md:text-[11px] font-bold text-zinc-300 hover:text-blue-400 transition-all cursor-pointer flex items-center gap-1 min-h-[44px]"
                >
                  {opt.label} <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
});
