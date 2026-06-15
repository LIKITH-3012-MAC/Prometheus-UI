import { defineComponent, ref } from "vue";
import AIOrb from "./AIOrb";
import ModeSelector from "./ModeSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { Plus, Pin, Trash2, Edit3, Search, MessageSquare } from "lucide-vue-next";

export default defineComponent({
  name: "LeftSidebar",
  props: {
    currentMode: { type: String, required: true },
    onModeChange: { type: Function, required: true },
    sessions: { type: Array, required: true }, // Array<{ id: string, title: string, pinned: boolean }>
    currentSessionId: { type: String, required: true },
    onSelectSession: { type: Function, required: true },
    onNewSession: { type: Function, required: true },
    onDeleteSession: { type: Function, required: true },
    onRenameSession: { type: Function, required: true },
    onTogglePinSession: { type: Function, required: true },
    theme: { type: String, required: true },
    onToggleTheme: { type: Function, required: true },
    userName: { type: String, default: "Commander" },
    onChangeUserName: { type: Function, required: true },
    voicePref: { type: String, default: "skip" },
    onChangeVoicePref: { type: Function, required: true },
  },
  setup(props, { attrs }) {
    const searchQuery = ref("");

    const handleRename = (id: string, currentTitle: string) => {
      const newTitle = prompt("Rename chat session:", currentTitle);
      if (newTitle && newTitle.trim()) {
        props.onRenameSession(id, newTitle.trim());
      }
    };

    const handleEditName = () => {
      const newName = prompt("Enter your name:", props.userName || "");
      if (newName !== null) {
        props.onChangeUserName(newName.trim() || "Commander");
      }
    };

    const handleResetProfile = () => {
      if (confirm("Reset profile and name onboarding? This will clear locally cached name variables.")) {
        localStorage.removeItem("prometheus_user_name");
        window.location.reload();
      }
    };

    const getFilteredSessions = () => {
      const query = searchQuery.value.toLowerCase().trim();
      if (!query) return props.sessions;
      return (props.sessions as any[]).filter((s) =>
        s.title.toLowerCase().includes(query)
      );
    };

    return () => {
      const filtered = getFilteredSessions();
      const pinned = filtered.filter((s) => s.pinned);
      const recents = filtered.filter((s) => !s.pinned);

      return (
        <aside class={["w-80 shrink-0 flex flex-col gap-5 p-5 border-r border-white/5 bg-[#030612]/30 backdrop-blur-md overflow-y-auto relative z-30 select-none h-full scrollbar-thin", attrs.class]}>
          
          {/* Reactor Core */}
          <AIOrb />

          {/* Identity profile */}
          <div className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex flex-col gap-1 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold tracking-[0.2em] text-blue-400 uppercase font-orbitron">
                Sovereign Link
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <div className="text-xs font-bold text-white tracking-wide font-orbitron truncate pr-2 max-w-[170px]">
                {props.userName || "Commander"}
              </div>
              <button
                onClick={handleEditName}
                className="p-1 text-zinc-500 hover:text-blue-400 hover:bg-white/5 rounded cursor-pointer transition-colors"
                title="Edit username"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[8px] text-zinc-500 font-mono-tech tracking-wider uppercase">
              Active Node • Sovereign Operator
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleResetProfile}
                className="text-[8px] font-bold text-zinc-500 hover:text-blue-400 font-orbitron uppercase tracking-wider cursor-pointer transition-colors"
              >
                Reset Profile
              </button>
            </div>
          </div>

          {/* Voice Personalization Settings Card */}
          <div className="p-4 rounded-xl bg-zinc-950/30 border border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between select-none">
              <span className="text-[8px] font-bold tracking-[0.2em] text-blue-400 uppercase font-orbitron">
                Voice Core Settings
              </span>
              <span className="text-[8px] font-mono-tech text-zinc-500 uppercase">
                TTS Configuration
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "male", label: "Male" },
                { id: "female", label: "Female" },
                { id: "auto", label: "Auto" },
                { id: "skip", label: "Default" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => props.onChangeVoicePref(opt.id)}
                  className={`py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider font-orbitron transition-all cursor-pointer ${
                    props.voicePref === opt.id
                      ? "bg-blue-950/40 border-blue-500/40 text-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.1)]"
                      : "bg-zinc-950/20 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode chips selector */}
          <ModeSelector
            currentMode={props.currentMode}
            onModeChange={props.onModeChange}
          />

          {/* Divider */}
          <div className="border-t border-white/5 my-1" />

          {/* Chat Vault Head */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase font-orbitron">
              Chat Vault
            </span>
            <button
              onClick={() => props.onNewSession()}
              className="p-1 rounded bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500/15 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider font-orbitron"
            >
              <Plus className="w-3.5 h-3.5" /> NEW CHAT
            </button>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-950/30">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery.value}
              onInput={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
              placeholder="Search chat log..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-600 font-medium font-orbitron"
            />
          </div>

          {/* Chat Sessions list */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[220px]">
            {/* Pinned list */}
            {pinned.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[8px] font-bold text-blue-400 uppercase tracking-widest font-orbitron select-none pl-1 flex items-center gap-1">
                  <Pin className="w-2.5 h-2.5" /> Pinned
                </div>
                {pinned.map((s) => (
                  <div
                    key={s.id}
                    className={`group/item flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      props.currentSessionId === s.id
                        ? "bg-blue-950/20 border-blue-500/30"
                        : "bg-zinc-950/20 border-white/5 hover:bg-zinc-900/30"
                    }`}
                    onClick={() => props.onSelectSession(s.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400/80 flex-shrink-0" />
                      <span className="text-xs text-zinc-300 group-hover/item:text-white truncate font-medium">
                        {s.title}
                      </span>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onTogglePinSession(s.id);
                        }}
                        className="p-1 text-blue-400 hover:bg-white/5 rounded"
                      >
                        <Pin className="w-3 h-3 fill-blue-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(s.id, s.title);
                        }}
                        className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onDeleteSession(s.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-blue-400 hover:bg-white/5 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recents list */}
            <div className="space-y-1.5">
              {pinned.length > 0 && recents.length > 0 && (
                <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-orbitron select-none pl-1">
                  Recents
                </div>
              )}
              {recents.map((s) => (
                <div
                  key={s.id}
                  className={`group/item flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    props.currentSessionId === s.id
                      ? "bg-blue-950/20 border-blue-500/30"
                      : "bg-zinc-950/20 border-white/5 hover:bg-zinc-900/30"
                  }`}
                  onClick={() => props.onSelectSession(s.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-300 group-hover/item:text-white truncate font-medium">
                      {s.title}
                    </span>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onTogglePinSession(s.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-blue-400 hover:bg-white/5 rounded"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(s.id, s.title);
                      }}
                      className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDeleteSession(s.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-blue-400 hover:bg-white/5 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-4 text-[10px] text-zinc-600 font-mono-tech">
                No sessions found.
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <ThemeSwitcher theme={props.theme} onToggleTheme={props.onToggleTheme} />

        </aside>
      );
    };
  },
});
