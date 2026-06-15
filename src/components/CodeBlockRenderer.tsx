import { defineComponent, ref, watch, onMounted } from "vue";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { Check, Copy, AlertTriangle, Lightbulb, Play, Zap, HelpCircle } from "lucide-vue-next";

export default defineComponent({
  name: "CodeBlockRenderer",
  props: {
    language: { type: String, default: "javascript" },
    value: { type: String, required: true },
    onAction: { type: Function, required: true },
  },
  setup(props) {
    const copied = ref(false);
    const highlightedCode = ref("");

    const highlight = () => {
      const lang = props.language.toLowerCase();
      const grammar = Prism.languages[lang] || Prism.languages.markup;
      highlightedCode.value = Prism.highlight(props.value, grammar, lang);
    };

    onMounted(highlight);
    watch(() => [props.value, props.language], highlight);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(props.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
      } catch (err) {
        console.error(err);
      }
    };

    return () => (
      <div className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-zinc-950 font-mono-tech text-xs">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center px-4 py-2 bg-zinc-900 border-b border-white/5 select-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
            {props.language}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer"
              title="Copy Code"
            >
              {copied.value ? (
                <Check className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Highlighted Pre tag */}
        <div className="overflow-x-auto p-4 max-h-[400px]">
          <pre className="!m-0 !p-0 !bg-transparent">
            <code
              class={`language-${props.language}`}
              v-html={highlightedCode.value}
            />
          </pre>
        </div>

        {/* Action Panel HUD */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-900/60 border-t border-white/5 select-none">
          <button
            onClick={() => props.onAction("Explain", props.value)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 text-[9px] font-bold uppercase tracking-wider text-zinc-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" /> Explain
          </button>
          <button
            onClick={() => props.onAction("Debug", props.value)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 text-[9px] font-bold uppercase tracking-wider text-zinc-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" /> Debug
          </button>
          <button
            onClick={() => props.onAction("Dry Run", props.value)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 text-[9px] font-bold uppercase tracking-wider text-zinc-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <Play className="w-3 h-3" /> Dry Run
          </button>
          <button
            onClick={() => props.onAction("Complexity", props.value)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 text-[9px] font-bold uppercase tracking-wider text-zinc-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" /> Complexity
          </button>
          <button
            onClick={() => props.onAction("Optimize", props.value)}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 text-[9px] font-bold uppercase tracking-wider text-zinc-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3 h-3" /> Optimize
          </button>
        </div>
      </div>
    );
  },
});
