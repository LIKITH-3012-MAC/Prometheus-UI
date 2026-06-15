import { defineComponent, ref } from "vue";
import { GraduationCap, CheckCircle2, Circle, Clock, Flame, X } from "lucide-vue-next";

export default defineComponent({
  name: "MissionControl",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
  },
  setup(props) {
    const modules = ref([
      {
        subject: "Data Structures & Algorithms",
        progress: 68,
        tasks: [
          { name: "Trees & Graphs traversals (DFS/BFS)", done: true },
          { name: "Dynamic Programming knapsacks & intervals", done: true },
          { name: "Sliding window & two pointers optimal solutions", done: false },
          { name: "Heap & Priority Queues algorithms", done: false }
        ]
      },
      {
        subject: "Advanced AI-ML (IIT-Patna Focus)",
        progress: 42,
        tasks: [
          { name: "Backpropagation weights derivation math", done: true },
          { name: "Convolutional filters feature mapping", done: false },
          { name: "Transformer self-attention query-key equations", done: false }
        ]
      },
      {
        subject: "Linux & DevOps Engineering",
        progress: 80,
        tasks: [
          { name: "Bash scripting for automated daemon logs", done: true },
          { name: "Multi-stage Dockerfile builds", done: true },
          { name: "Kubernetes pod startup lifecycle YAML probes", done: false }
        ]
      }
    ]);

    const toggleTask = (moduleIndex: number, taskIndex: number) => {
      const task = modules.value[moduleIndex].tasks[taskIndex];
      task.done = !task.done;

      // Recalculate progress
      const module = modules.value[moduleIndex];
      const completed = module.tasks.filter((t) => t.done).length;
      module.progress = Math.round((completed / module.tasks.length) * 100);
    };

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
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm md:text-base font-extrabold font-orbitron tracking-tight text-white uppercase">
                  PROMETHEUS MISSION CONTROL
                </h3>
              </div>
              <button
                onClick={() => props.onClose()}
                className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Daily Streak Indicator */}
              <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-500/20 flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-blue-500 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-zinc-200 font-orbitron">Academic Streak: 12 Days</div>
                    <div className="text-[10px] text-zinc-500 font-mono-tech mt-0.5">Keep executing daily commands to build placement sync parameters.</div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-blue-400 bg-blue-950/30 px-2.5 py-1 rounded border border-blue-500/25 font-orbitron flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 84 Hours Logged
                </span>
              </div>

              {/* Modules list */}
              {modules.value.map((mod, modIdx) => (
                <div key={modIdx} className="space-y-3">
                  <div className="flex justify-between items-center select-none px-1">
                    <span className="text-[10px] font-black tracking-widest text-blue-400/80 uppercase font-orbitron">
                      {mod.subject}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 font-mono-tech">
                      {mod.progress}% Done
                    </span>
                  </div>

                  {/* Task card list */}
                  <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/5 space-y-2.5">
                    {mod.tasks.map((task, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => toggleTask(modIdx, tIdx)}
                        className="w-full text-left flex items-start gap-3 p-2 rounded-lg bg-zinc-900/30 hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-zinc-600 group-hover:text-blue-400 flex-shrink-0" />
                        )}
                        <span className={`text-xs font-mono-tech ${task.done ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white"}`}>
                          {task.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-zinc-950/80 select-none text-[8.5px] font-bold text-zinc-600 uppercase tracking-widest font-mono-tech">
              Academic study plan tracked locally • Prometheus Core Systems
            </div>
          </div>
        </div>
      );
    };
  },
});
