import { defineComponent } from "vue";
import { Sparkles, GraduationCap, Code2, FileText, ChevronRight, X } from "lucide-vue-next";

export default defineComponent({
  name: "FeaturesDrawer",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
    onSelectFeature: { type: Function, required: true },
  },
  setup(props) {
    const categories = [
      {
        title: "Learning",
        icon: Sparkles,
        items: [
          { id: "simplify", label: "Simplify", desc: "Reduce complexity & explain simply" },
          { id: "telish", label: "Telugu-English", desc: "Explain in conversational Telish" },
          { id: "stepbystep", label: "Step-by-step", desc: "Break down into procedural steps" },
          { id: "example", label: "Explain with Example", desc: "Show concrete execution examples" },
          { id: "deeper", label: "Deeper", desc: "Explore math, proofs, and deep details" },
          { id: "shorter", label: "Shorter", desc: "Summarize as short & concise text" },
          { id: "followup", label: "Ask Follow-up Questions", desc: "Test comprehension of details" },
        ]
      },
      {
        title: "Interview",
        icon: GraduationCap,
        items: [
          { id: "interview_qa", label: "Interview Q&A", desc: "Frame as direct question & answers" },
          { id: "mock_questions", label: "Mock Questions", desc: "Simulate a mock technical drill" },
          { id: "hr_answer", label: "Make Interview Answer", desc: "Formulate a professional HR response" },
          { id: "resume_points", label: "Make Resume Points", desc: "Generate bullet points with action verbs" },
        ]
      },
      {
        title: "Coding",
        icon: Code2,
        items: [
          { id: "debug", label: "Debug", desc: "Find edge cases, bugs & fix code" },
          { id: "optimize", label: "Optimize", desc: "Refactor code for speed/memory" },
          { id: "dryrun", label: "Dry Run", desc: "Trace variables step-by-step" },
          { id: "complexity", label: "Complexity", desc: "Perform Big-O time & space audits" },
          { id: "convert_lang", label: "Convert Language", desc: "Translate syntax to another language" },
        ]
      },
      {
        title: "File",
        icon: FileText,
        items: [
          { id: "summary", label: "Summary", desc: "Summarize core details of document" },
          { id: "key_points", label: "Key Points", desc: "Highlight critical take-aways" },
          { id: "notes", label: "Notes", desc: "Generate structured study notes" },
          { id: "extract_info", label: "Extract Info", desc: "Retrieve tables, schemas, metadata" },
          { id: "analyze_data", label: "Analyze Data", desc: "Analyze patterns inside files/CSVs" },
        ]
      }
    ];

    return () => {
      if (!props.isOpen) return null;

      return (
        <>
          {/* Backdrop on mobile/tablet to dismiss the bottom drawer */}
          <div 
            onClick={() => props.onClose()}
            className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300"
          />

          <div 
            className="fixed md:absolute bottom-0 md:bottom-24 left-0 right-0 md:left-8 md:right-8 z-[60] md:z-40 p-5 rounded-t-3xl md:rounded-2xl border-x-0 border-b-0 border-t md:border border-blue-500/35 bg-[#050914]/98 backdrop-blur-md shadow-[0_-12px_40px_rgba(0,102,255,0.2)] animate-in slide-in-from-bottom duration-300 flex flex-col gap-4 font-orbitron"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                <h3 className="text-sm font-extrabold tracking-tight text-white uppercase">
                  Prometheus Command Drawer
                </h3>
              </div>
              <button
                onClick={() => props.onClose()}
                className="p-2.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[50vh] md:max-h-[350px] overflow-y-auto pr-1">
              {categories.map((cat, catIdx) => {
                const CatIcon = cat.icon;
                return (
                  <div key={catIdx} className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5 px-1 pb-1 border-b border-white/5">
                      <CatIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        {cat.title}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {cat.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            props.onSelectFeature(item.id);
                          }}
                          className="w-full text-left p-3.5 md:p-2 rounded-lg bg-zinc-950/20 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group flex items-start justify-between gap-2 cursor-pointer min-h-[44px]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-[9px] text-zinc-500 font-mono-tech mt-0.5 leading-normal truncate">
                              {item.desc}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    };
  },
});
