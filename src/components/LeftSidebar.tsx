import { defineComponent, ref, onMounted } from "vue";
import AIOrb from "./AIOrb";
import ModeSelector from "./ModeSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { 
  Plus, Pin, Trash2, Edit3, Search, MessageSquare, 
  User, Mic, Sparkles, Database, Moon, Sun, X 
} from "lucide-vue-next";

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

    // Collapsibility States
    const isProfileCollapsed = ref(false);
    const isVoiceCollapsed = ref(false);
    const isModeCollapsed = ref(false);
    const isVaultCollapsed = ref(false);
    const isThemeCollapsed = ref(false);

    onMounted(() => {
      isProfileCollapsed.value = localStorage.getItem("prometheus_sidebar_profile_collapsed") === "true";
      isVoiceCollapsed.value = localStorage.getItem("prometheus_sidebar_voice_collapsed") === "true";
      isModeCollapsed.value = localStorage.getItem("prometheus_sidebar_mode_collapsed") === "true";
      isVaultCollapsed.value = localStorage.getItem("prometheus_sidebar_vault_collapsed") === "true";
      isThemeCollapsed.value = localStorage.getItem("prometheus_sidebar_theme_collapsed") === "true";
    });

    const toggleProfile = () => {
      isProfileCollapsed.value = !isProfileCollapsed.value;
      localStorage.setItem("prometheus_sidebar_profile_collapsed", String(isProfileCollapsed.value));
    };

    const toggleVoice = () => {
      isVoiceCollapsed.value = !isVoiceCollapsed.value;
      localStorage.setItem("prometheus_sidebar_voice_collapsed", String(isVoiceCollapsed.value));
    };

    const toggleMode = () => {
      isModeCollapsed.value = !isModeCollapsed.value;
      localStorage.setItem("prometheus_sidebar_mode_collapsed", String(isModeCollapsed.value));
    };

    const toggleVault = () => {
      isVaultCollapsed.value = !isVaultCollapsed.value;
      localStorage.setItem("prometheus_sidebar_vault_collapsed", String(isVaultCollapsed.value));
    };

    const toggleTheme = () => {
      isThemeCollapsed.value = !isThemeCollapsed.value;
      localStorage.setItem("prometheus_sidebar_theme_collapsed", String(isThemeCollapsed.value));
    };

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
          {isProfileCollapsed.value ? (
            <div 
              onClick={toggleProfile}
              className="p-3.5 rounded-xl bg-[#050914]/60 border border-white/5 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all font-orbitron"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 truncate max-w-[150px]">
                  Identity ({props.userName})
                </span>
              </div>
              <span className="text-[7.5px] font-mono-tech text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/15">MIN</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#050914]/60 border border-white/5 flex flex-col gap-1 relative overflow-hidden group font-orbitron">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleProfile(); }}
                className="absolute top-2.5 right-2.5 text-zinc-600 hover:text-white transition-colors cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                title="Collapse Section"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-[0.2em] text-blue-400 uppercase">
                  Sovereign Link
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-5" />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="text-xs font-bold text-white tracking-wide truncate pr-2 max-w-[170px]">
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
                  className="text-[8px] font-bold text-zinc-500 hover:text-blue-400 uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Reset Profile
                </button>
              </div>
            </div>
          )}

          {/* Voice Personalization Settings Card */}
          {isVoiceCollapsed.value ? (
            <div 
              onClick={toggleVoice}
              className="p-3.5 rounded-xl bg-[#050914]/60 border border-white/5 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all font-orbitron"
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Voice Core ({props.voicePref.toUpperCase()})
                </span>
              </div>
              <span className="text-[7.5px] font-mono-tech text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/15">MIN</span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#050914]/60 border border-white/5 flex flex-col gap-2.5 relative font-orbitron">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleVoice(); }}
                className="absolute top-2.5 right-2.5 text-zinc-600 hover:text-white transition-colors cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                title="Collapse Section"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between select-none">
                <span className="text-[8px] font-bold tracking-[0.2em] text-blue-400 uppercase">
                  Voice Core Settings
                </span>
                <span className="text-[8px] font-mono-tech text-zinc-500 uppercase mr-5">
                  TTS Config
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
                    className={`py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
          )}

          {/* Mode chips selector */}
          {isModeCollapsed.value ? (
            <div 
              onClick={toggleMode}
              className="p-3.5 rounded-xl bg-[#050914]/60 border border-white/5 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all font-orbitron"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Mode: {props.currentMode.toUpperCase()}
                </span>
              </div>
              <span className="text-[7.5px] font-mono-tech text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/15">MIN</span>
            </div>
          ) : (
            <div className="relative font-orbitron">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleMode(); }}
                className="absolute top-0 right-0.5 text-zinc-600 hover:text-white transition-colors cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center z-40"
                title="Collapse Section"
              >
                <X className="w-3 h-3" />
              </button>
              <ModeSelector
                currentMode={props.currentMode}
                onModeChange={props.onModeChange}
              />
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/5 my-1" />

          {/* Chat Vault */}
          {isVaultCollapsed.value ? (
            <div 
              onClick={toggleVault}
              className="p-3.5 rounded-xl bg-[#050914]/60 border border-white/5 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all font-orbitron"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Chat Vault ({props.sessions.length})
                </span>
              </div>
              <span className="text-[7.5px] font-mono-tech text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/15">MIN</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 min-h-0 relative font-orbitron">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleVault(); }}
                className="absolute top-0.5 right-0.5 text-zinc-600 hover:text-white transition-colors cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center z-40"
                title="Collapse Section"
              >
                <X className="w-3 h-3" />
              </button>
              
              {/* Chat Vault Head */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase">
                  Chat Vault
                </span>
                <button
                  onClick={() => props.onNewSession()}
                  className="p-1 rounded bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500/15 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider mr-6"
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
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-600 font-medium"
                />
              </div>

              {/* Chat Sessions list */}
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[220px] scrollbar-thin">
                {/* Pinned list */}
                {pinned.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[8px] font-bold text-blue-400 uppercase tracking-widest select-none pl-1 flex items-center gap-1">
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
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest select-none pl-1">
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
            </div>
          )}

          {/* Theme switcher */}
          {isThemeCollapsed.value ? (
            <div 
              onClick={toggleTheme}
              className="p-3.5 rounded-xl bg-[#050914]/60 border border-white/5 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all font-orbitron"
            >
              <div className="flex items-center gap-2.5">
                {props.theme === "dark" ? (
                  <Moon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Theme ({props.theme.toUpperCase()})
                </span>
              </div>
              <span className="text-[7.5px] font-mono-tech text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/15">MIN</span>
            </div>
          ) : (
            <div className="relative font-orbitron">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                className="absolute top-0 right-0 text-zinc-600 hover:text-white transition-colors cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center z-40"
                title="Collapse Section"
              >
                <X className="w-3 h-3" />
              </button>
              <ThemeSwitcher theme={props.theme} onToggleTheme={props.onToggleTheme} />
            </div>
          )}

        </aside>
      );
    };
  },
});
