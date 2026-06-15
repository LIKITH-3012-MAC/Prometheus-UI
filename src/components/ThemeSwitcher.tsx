import { defineComponent } from "vue";
import { Sun, Moon } from "lucide-vue-next";

export default defineComponent({
  name: "ThemeSwitcher",
  props: {
    theme: { type: String, required: true },
    onToggleTheme: { type: Function, required: true },
  },
  setup(props) {
    return () => (
      <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/5 shadow-inner mt-auto flex items-center justify-between select-none">
        <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-orbitron">
          Interface Theme
        </span>
        <button
          onClick={() => props.onToggleTheme()}
          className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-500/30 bg-zinc-900 text-blue-400 hover:bg-blue-500/15 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider font-orbitron shadow-md"
        >
          {props.theme === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5" />
              <span>OBSIDIAN</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5" />
              <span>SAAS LIGHT</span>
            </>
          )}
        </button>
      </div>
    );
  },
});
