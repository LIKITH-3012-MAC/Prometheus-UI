import { Cpu, Wifi, Database, X } from "lucide-vue-next";

export default defineComponent({
  name: "SystemTelemetryPanel",
  props: {
    currentMode: { type: String, required: true },
    isVoiceInputActive: { type: Boolean, default: false },
    isTtsActive: { type: Boolean, default: false },
    messagesCount: { type: Number, default: 0 },
    isStreaming: { type: Boolean, default: false },
    onClose: { type: Function, default: null }
  },
  setup(props) {
    const cpuLoad = ref(22);
    const latency = ref(115);

    let intervalId: number;

    onMounted(() => {
      intervalId = window.setInterval(() => {
        cpuLoad.value = Math.min(
          Math.max(Math.round(cpuLoad.value + (Math.random() * 8 - 4)), 10),
          55
        );
        latency.value = Math.min(
          Math.max(Math.round(latency.value + (Math.random() * 18 - 9)), 90),
          170
        );
      }, 3000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    const getModeFocus = () => {
      const foci: Record<string, string> = {
        general: "Sovereign Operations Engine",
        dsa: "Algorithm Complexity Optimization",
        aiml: "Neural Weight Adjustment (IIT-Patna)",
        fullstack: "Web Scalability & REST Engineering",
        sql: "Query Processing & Tuning",
        linux: "Infrastructure & Containerization",
        placement: "Technical Interview Alignment",
      };
      return foci[props.currentMode] || "System Operations Core";
    };

    return () => (
      <div className="flex flex-col gap-6 select-none w-full font-orbitron">
        {/* HUD Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase">
              Telemetry
            </span>
            <span className="inline-flex items-center gap-1.5 text-[8px] font-black tracking-widest text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-500/20">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              ONLINE
            </span>
          </div>
          {props.onClose && (
            <button
              onClick={() => props.onClose()}
              className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/5 cursor-pointer flex items-center justify-center"
              title="Close Telemetry"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* CPU Load card */}
          <div className="p-3.5 rounded-xl bg-zinc-950/30 border border-white/5">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[8px] font-bold tracking-widest uppercase">CPU</span>
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base font-black text-zinc-100 tracking-wider">
              {cpuLoad.value}%
            </div>
            <div className="w-full bg-zinc-900/60 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-blue-400 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${cpuLoad.value}%` }}
              />
            </div>
          </div>

          {/* Latency card */}
          <div className="p-3.5 rounded-xl bg-zinc-950/30 border border-white/5">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[8px] font-bold tracking-widest uppercase">PING</span>
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base font-black text-zinc-100 tracking-wider">
              {latency.value}ms
            </div>
            <div className="w-full bg-zinc-900/60 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-blue-400 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${(latency.value / 200) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streaming Token Indicator */}
        {props.isStreaming && (
          <div className="p-3.5 rounded-xl border border-blue-500/25 bg-blue-950/10 flex items-center justify-between animate-pulse">
            <span className="text-[8px] font-bold text-blue-400 tracking-wider">SYNC ACTIVE</span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-2.5 bg-blue-400 rounded-full animate-bounce" />
              <span className="w-1 h-3.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Focus section */}
        <div className="p-4 rounded-xl bg-zinc-950/20 border border-white/5 flex flex-col gap-1.5">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
            Learning Focus
          </span>
          <div className="text-[10px] font-bold text-zinc-300 leading-relaxed font-mono-tech">
            {getModeFocus()}
          </div>
        </div>

        {/* Rings Progress */}
        <div className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-zinc-900"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-blue-500 transition-all duration-1000"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * 78) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-blue-400">
                78%
              </div>
            </div>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
              Sync
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-zinc-900"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="stroke-blue-500 transition-all duration-1000"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * cpuLoad.value) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-blue-400">
                {cpuLoad.value}%
              </div>
            </div>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
              Engine
            </span>
          </div>
        </div>
      </div>
    );
  },
});
