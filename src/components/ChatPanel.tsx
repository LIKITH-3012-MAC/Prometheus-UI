import { defineComponent, ref, watch, onMounted } from "vue";
import ChatMessage from "./ChatMessage";
import { Terminal, Cpu, ShieldAlert, Code2 } from "lucide-vue-next";

export default defineComponent({
  name: "ChatPanel",
  props: {
    messages: { type: Array, required: true }, // Array<{ role: string, content: string }>
    loading: { type: Boolean, default: false },
    onSelectPrompt: { type: Function, required: true },
    onCodeAction: { type: Function, required: true },
    onSelectFileOption: { type: Function, required: false },
  },
  setup(props) {
    const containerRef = ref<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
      const container = containerRef.value;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    };

    onMounted(scrollToBottom);
    watch(() => [props.messages.length, props.loading], () => {
      setTimeout(scrollToBottom, 50);
    });

    const starterPrompts = [
      { title: "AI/ML Engineering", query: "Explain neural network weights backpropagation in simple terms with a dry run.", icon: Cpu },
      { title: "DSA Strategy", query: "Intuition of finding cycle in a linked list. What is the optimal approach and complexity?", icon: Code2 },
      { title: "Linux & DevOps", query: "Write a bash script template to audit server load and send automated docker logs.", icon: Terminal },
      { title: "Spring Boot & React", query: "Design REST API guidelines for a secure student placement dashboard.", icon: ShieldAlert },
    ];

    return () => (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 md:px-8 space-y-6 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent select-text"
      >
        {props.messages.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500 select-none">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl scale-150 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-blue-950/40 border border-blue-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,102,255,0.25)]">
                <Terminal className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-tight text-white uppercase italic">
                Prometheus OS Core
              </h2>
              <p className="text-xs text-zinc-500 tracking-[0.2em] font-bold uppercase font-orbitron">
                Sovereign Assistant Node • Prometheus Core
              </p>
              <p className="max-w-md mx-auto text-xs md:text-sm text-zinc-400 font-mono-tech leading-relaxed px-4">
                Welcome to the AI classroom command center. Focus: Advanced AI-ML, DSA algorithms, full stack, DevOps, and placements.
              </p>
            </div>

            {/* Starter Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4 pt-4">
              {starterPrompts.map((p, i) => {
                const Icon = p.icon;
                return (
                  <button
                    key={i}
                    onClick={() => props.onSelectPrompt(p.query)}
                    className="p-5 text-left rounded-2xl bg-zinc-950/20 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group flex items-start gap-4 cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-white/5 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/15 transition-colors border border-white/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-blue-400/80 font-orbitron tracking-wider group-hover:text-blue-300">
                        {p.title}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono-tech mt-1 leading-normal">
                        {p.query}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Message feed
          <div className="max-w-4xl mx-auto space-y-6">
            {(props.messages as any[]).map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                onCodeAction={props.onCodeAction}
                onSelectFileOption={props.onSelectFileOption}
              />
            ))}

            {/* Glowing AI Thinking state */}
            {props.loading && (
              <div className="flex justify-start animate-in fade-in duration-300 select-none">
                <div className="glass-panel p-6 rounded-[24px] border-l-[3px] border-l-blue-500 mr-12 text-zinc-100 max-w-[75%] space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-orbitron text-blue-400">
                      Syncing Reasoning Node
                    </span>
                  </div>
 
                  {/* Audio Waveform Thinking Animation */}
                  <div className="flex items-center gap-1.5 py-1">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full animate-[float_1s_ease-in-out_infinite]" />
                    <div className="w-1.5 h-8 bg-blue-400 rounded-full animate-[float_1s_ease-in-out_0.2s_infinite]" />
                    <div className="w-1.5 h-5 bg-blue-500 rounded-full animate-[float_1s_ease-in-out_0.4s_infinite]" />
                    <div className="w-1.5 h-7 bg-blue-400 rounded-full animate-[float_1s_ease-in-out_0.1s_infinite]" />
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-[float_1s_ease-in-out_0.3s_infinite]" />
                    <span className="text-xs text-zinc-500 font-mono-tech ml-2 animate-pulse">
                      Computing optimal answer...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});
