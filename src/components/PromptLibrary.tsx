import { defineComponent } from "vue";
import { Search, Sparkles, BookOpen, X } from "lucide-vue-next";

export default defineComponent({
  name: "PromptLibrary",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
    onSelectPrompt: { type: Function, required: true },
  },
  setup(props) {
    const templates = [
      {
        category: "Data Structures & Algorithms",
        prompts: [
          { title: "DFS vs BFS Graph Traversal", text: "Explain Depth First Search vs Breadth First Search graph traversal in simple Telish with a dry run on a sample graph." },
          { title: "Merge Sort Space Optimization", text: "How does Merge Sort work? Can we optimize its auxiliary space complexity? Explain intuitively." },
          { title: "Dynamic Programming Knapsack", text: "Intuition of 0-1 Knapsack problem. Explain the overlapping subproblems pattern and the memoization approach." }
        ]
      },
      {
        category: "Advanced AI-ML",
        prompts: [
          { title: "Transformer Self-Attention", text: "Break down the Transformer Query, Key, Value Self-Attention formula. Why do we scale by sqrt(d_k)?" },
          { title: "Gradient Descent Optimizers", text: "Explain Adam optimizer vs SGD with momentum. When should we use which and why?" },
          { title: "CNN Feature Mapping", text: "How do Convolutional Neural Networks build hierarchical feature maps? Explain spatial dimension reduction equations." }
        ]
      },
      {
        category: "Full Stack & DevOps",
        prompts: [
          { title: "JWT Token Security Flow", text: "Design secure guidelines for JWT access and refresh token authentication in a React + Spring Boot application." },
          { title: "Docker Containerization Orchestration", text: "Explain Docker containerization vs virtualization. Write a clean Multi-stage Dockerfile for a Vue+Node project." },
          { title: "Kubernetes Pod Lifecycle", text: "Explain Kubernetes Pod startup lifecycle probes (liveness, readiness, startup) with YAML configs." }
        ]
      }
    ];

    return () => {
      if (!props.isOpen) return null;

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl glass-panel rounded-2xl border border-blue-500/20 overflow-hidden shadow-[0_0_50px_rgba(0,102,255,0.15)] flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-zinc-950/50 select-none">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm md:text-base font-extrabold font-orbitron tracking-tight text-white uppercase">
                  PROMETHEUS PROMPT LIBRARY
                </h3>
              </div>
              <button
                onClick={() => props.onClose()}
                className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {templates.map((cat, i) => (
                <div key={i} className="space-y-3">
                  <div className="text-[10px] font-black tracking-widest text-blue-400/80 uppercase font-orbitron select-none pl-1">
                    {cat.category}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {cat.prompts.map((p, j) => (
                      <button
                        key={j}
                        onClick={() => {
                          props.onSelectPrompt(p.text);
                          props.onClose();
                        }}
                        className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-blue-500/35 hover:bg-blue-500/5 hover:scale-[1.01] transition-all duration-200 text-left flex flex-col gap-1.5 cursor-pointer group"
                      >
                        <span className="text-xs font-bold text-zinc-200 font-orbitron group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono-tech leading-normal line-clamp-2">
                          {p.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-zinc-950/80 select-none text-[8.5px] font-bold text-zinc-600 uppercase tracking-widest font-mono-tech">
              Select any prompt template to auto-inject into compiler
            </div>
          </div>
        </div>
      );
    };
  },
});
