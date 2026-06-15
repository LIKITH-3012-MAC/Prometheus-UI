import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "UserOnboarding",
  emits: ["complete"],
  setup(props, { emit }) {
    const step = ref(1);
    const nameInput = ref("");
    const isTransitioning = ref(false);
    
    // Temporary name storage before step 2
    const tempName = ref("");

    const handleNextStep = () => {
      const trimmed = nameInput.value.trim();
      tempName.value = trimmed || "Commander";
      step.value = 2;
    };

    const handleSkipName = () => {
      tempName.value = "Commander";
      step.value = 2;
    };

    const handleSelectVoice = (voicePref: string) => {
      isTransitioning.value = true;
      setTimeout(() => {
        emit("complete", tempName.value, voicePref);
      }, 500);
    };

    return () => (
      <div
        className={`fixed inset-0 z-[9998] bg-[#000000] flex flex-col items-center justify-center transition-all duration-[500ms] ease-in-out select-none overflow-y-auto p-4 ${
          isTransitioning.value ? "opacity-0 blur-2xl scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Cinematic Grid & Overlay */}
        <div className="cinematic-grid !opacity-20" />
        <div className="scan-line-overlay !opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.05)_0%,transparent_70%)] pointer-events-none" />

        {/* Onboarding Glass Card */}
        <div className="glass-panel w-[90%] max-w-[420px] p-6 md:p-10 rounded-[28px] flex flex-col gap-6 text-center relative z-10 border border-white/10 shadow-[0_0_40px_rgba(0,102,255,0.1)] hover:shadow-[0_0_50px_rgba(0,102,255,0.15)] transition-all">
          
          {step.value === 1 ? (
            // STEP 1: Username Input
            <div className="flex flex-col gap-6">
              <div className="space-y-2 select-none">
                <span className="text-[9px] font-bold tracking-[0.25em] text-blue-400 uppercase font-orbitron">
                  Sovereign Access Initialize
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                  Before we begin…
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                  What should Prometheus call you?
                </p>
                
                <input
                  type="text"
                  value={nameInput.value}
                  onInput={(e) => (nameInput.value = (e.target as HTMLInputElement).value)}
                  onKeyup={(e) => { if (e.key === "Enter") handleNextStep(); }}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-950/60 border border-white/10 focus:border-blue-500/40 rounded-xl px-4 py-3.5 text-center text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(0,102,255,0.15)] font-orbitron"
                  maxLength={30}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-[0.2em] font-orbitron hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,102,255,0.2)] cursor-pointer"
                >
                  NEXT STEP ➔
                </button>
                <button
                  onClick={handleSkipName}
                  className="w-full py-2.5 border border-white/5 hover:border-blue-500/20 text-zinc-500 hover:text-zinc-300 rounded-xl text-[9px] tracking-widest font-orbitron uppercase cursor-pointer transition-all"
                >
                  SKIP
                </button>
              </div>
            </div>
          ) : (
            // STEP 2: Voice Preference
            <div className="flex flex-col gap-6">
              <div className="space-y-2 select-none">
                <span className="text-[9px] font-bold tracking-[0.25em] text-blue-400 uppercase font-orbitron">
                  Voice Core Synthesis
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                  Choose your Prometheus voice
                </h2>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  onClick={() => handleSelectVoice("male")}
                  className="w-full py-3 border border-white/10 hover:border-blue-500/40 bg-zinc-950/40 hover:bg-blue-500/10 text-white rounded-xl text-xs font-bold font-orbitron cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Clear Male Voice
                </button>
                <button
                  onClick={() => handleSelectVoice("female")}
                  className="w-full py-3 border border-white/10 hover:border-blue-500/40 bg-zinc-950/40 hover:bg-blue-500/10 text-white rounded-xl text-xs font-bold font-orbitron cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Clear Female Voice
                </button>
                <button
                  onClick={() => handleSelectVoice("auto")}
                  className="w-full py-3 border border-white/10 hover:border-blue-500/40 bg-zinc-950/40 hover:bg-blue-500/10 text-white rounded-xl text-xs font-bold font-orbitron cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Auto Preference
                </button>
                <button
                  onClick={() => handleSelectVoice("skip")}
                  className="w-full py-2.5 border border-white/5 hover:border-blue-500/20 text-zinc-500 hover:text-zinc-300 rounded-xl text-[9px] tracking-widest font-orbitron uppercase cursor-pointer transition-all"
                >
                  SKIP / DEFAULT
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  },
});
