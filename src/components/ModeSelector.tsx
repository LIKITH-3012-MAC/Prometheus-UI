import { defineComponent } from "vue";
import { Sparkles, Code2, Cpu, Globe, Database, Terminal, GraduationCap } from "lucide-vue-next";

export default defineComponent({
  name: "ModeSelector",
  props: {
    currentMode: { type: String, required: true },
    onModeChange: { type: Function, required: true },
  },
  setup(props) {
    const modes = [
      { id: "general", label: "General Core", desc: "Standard sovereign intelligence interface", icon: Sparkles },
      { id: "dsa", label: "DSA Mentor", desc: "Data Structures & Algorithm strategy", icon: Code2 },
      { id: "aiml", label: "AI/ML Engineer", desc: "Neural networks & advanced model training", icon: Cpu },
      { id: "fullstack", label: "Full Stack Architect", desc: "React, Next.js, API, and db engineering", icon: Globe },
      { id: "sql", label: "SQL Analyst", desc: "Relational database queries & optimization", icon: Database },
      { id: "linux", label: "Linux & DevOps", desc: "Bash commands, Docker, and CI/CD pipelines", icon: Terminal },
      { id: "placement", label: "Placement Coach", desc: "Resume auditing & interview engineering", icon: GraduationCap },
    ];

    return () => (
      <div className="flex flex-col gap-4 select-none w-full">
        {/* Modes label */}
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase font-orbitron">
            Intelligence Modes
          </span>
          <span className="text-[8px] font-bold text-blue-500 bg-blue-950/30 px-2 py-0.5 rounded-full font-mono-tech border border-blue-500/10">
            MODE SYNCED
          </span>
        </div>

        {/* Mode List chips */}
        <div className="flex flex-col gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = props.currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => props.onModeChange(mode.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-3 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? "bg-blue-950/20 border-blue-500/35 shadow-[0_0_15px_rgba(0,102,255,0.08)]"
                    : "bg-zinc-950/15 border-white/5 hover:bg-zinc-900/30 hover:border-white/10"
                }`}
              >
                {/* Highlight line */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500" />
                )}

                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-white/5 text-zinc-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold font-orbitron tracking-wide transition-colors ${
                      isActive ? "text-blue-400" : "text-zinc-300 group-hover:text-white"
                    }`}
                  >
                    {mode.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
});
