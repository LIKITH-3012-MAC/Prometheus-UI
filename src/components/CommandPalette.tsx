import { defineComponent, ref, watch, onMounted, onUnmounted } from "vue";
import { Search, Terminal, Trash2, Mic, Volume2, ShieldAlert, Cpu, GraduationCap, Code } from "lucide-vue-next";

export default defineComponent({
  name: "CommandPalette",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
    onSelectCommand: { type: Function, required: true },
  },
  setup(props) {
    const search = ref("");
    const selectedIndex = ref(0);
    const inputRef = ref<HTMLInputElement | null>(null);

    const commands = [
      { id: "clear", label: "Clear Chat Memory", desc: "Flush the current message state", icon: Trash2 },
      { id: "export", label: "Export Session (Markdown)", desc: "Download chat transcript", icon: Terminal },
      { id: "voice", label: "Toggle Voice Input (STT)", desc: "Turn voice controls on/off", icon: Mic },
      { id: "tts", label: "Toggle Text-to-Speech (TTS)", desc: "Hear responses read aloud", icon: Volume2 },
      { id: "library", label: "Open Prompt Library", desc: "Explore starter prompt templates", icon: ShieldAlert },
      { id: "mission", label: "Open Mission Control", desc: "View advanced academic study planner", icon: GraduationCap },
      { id: "mode_dsa", label: "DSA Mentor Mode", desc: "Focus on coding algorithms & dry runs", icon: Code },
      { id: "mode_aiml", label: "AI/ML Engineer Mode", desc: "Deep dive into model mathematics & formulas", icon: Cpu },
      { id: "mode_sql", label: "SQL Analyst Mode", desc: "Focus on SQL queries and tuning", icon: Terminal },
      { id: "theme", label: "Switch Theme Mode", desc: "Toggle dark obsidian / light SaaS interface", icon: ShieldAlert },
    ];

    const getFilteredCommands = () => {
      return commands.filter(
        (c) =>
          c.label.toLowerCase().includes(search.value.toLowerCase()) ||
          c.desc.toLowerCase().includes(search.value.toLowerCase())
      );
    };

    watch(() => props.isOpen, (val) => {
      if (val) {
        search.value = "";
        selectedIndex.value = 0;
        setTimeout(() => inputRef.value?.focus(), 50);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!props.isOpen) return;

      const filtered = getFilteredCommands();

      if (e.key === "Escape") {
        props.onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex.value = (selectedIndex.value + 1) % Math.max(1, filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex.value = (selectedIndex.value - 1 + filtered.length) % Math.max(1, filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex.value]) {
          props.onSelectCommand(filtered[selectedIndex.value].id);
          props.onClose();
        }
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });

    return () => {
      if (!props.isOpen) return null;

      const filtered = getFilteredCommands();

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl glass-panel rounded-2xl border border-blue-500/20 overflow-hidden shadow-[0_0_50px_rgba(0,102,255,0.15)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-zinc-950/50">
              <Search className="w-5 h-5 text-blue-400/70" />
              <input
                ref={inputRef}
                type="text"
                value={search.value}
                onInput={(e) => {
                  search.value = (e.target as HTMLInputElement).value;
                  selectedIndex.value = 0;
                }}
                placeholder="Search command palette..."
                className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-zinc-500 font-orbitron tracking-wide"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-zinc-400 select-none">
                ESC
              </kbd>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 bg-zinc-950/20">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 font-mono-tech select-none">
                  No matching commands found.
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex.value;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        props.onSelectCommand(cmd.id);
                        props.onClose();
                      }}
                      onMouseenter={() => (selectedIndex.value = idx)}
                      className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-blue-500/10 border-l-[3px] border-l-blue-500 pl-3 border border-white/5"
                          : "bg-transparent border border-transparent pl-4"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-zinc-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-zinc-200 font-orbitron tracking-wide">
                          {cmd.label}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono-tech truncate">
                          {cmd.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[9px] font-black uppercase text-blue-400 font-orbitron select-none">
                          Execute
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-white/5 bg-zinc-950/80 select-none">
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest font-mono-tech">
                Prometheus Command Module
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-zinc-500 flex items-center gap-1 font-mono-tech">
                  <span className="font-bold">↑↓</span> Navigate
                </span>
                <span className="text-[9px] text-zinc-500 flex items-center gap-1 font-mono-tech">
                  <span className="font-bold">⏎</span> Select
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
