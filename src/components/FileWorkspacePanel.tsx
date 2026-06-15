import { defineComponent, ref } from "vue";
import { X, Paperclip, FileText, Trash2, ArrowUpRight, CheckCircle, Sparkles } from "lucide-vue-next";

export default defineComponent({
  name: "FileWorkspacePanel",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
    uploadedFile: { type: Object, default: null }, // { name: string, size: number, type: string, text: string, base64: string }
    onRemoveFile: { type: Function, required: true },
    onSelectAction: { type: Function, required: true }, // (actionId: string) => void
    onUploadClick: { type: Function, required: true },
  },
  setup(props) {
    const formatSize = (bytes: number) => {
      if (!bytes) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getActions = () => {
      const type = props.uploadedFile?.type || "";
      const name = props.uploadedFile?.name || "";
      const ext = name.split(".").pop()?.toLowerCase() || "";

      const defaultActions = [
        { id: "summary", label: "Summarize", desc: "Brief core summary" },
        { id: "key_points", label: "Key Points", desc: "Extract key bullet points" },
        { id: "notes", label: "Study Notes", desc: "Generate structured study notes" },
      ];

      const codeExtensions = ["js", "jsx", "ts", "tsx", "py", "java", "c", "cpp", "h", "html", "css", "sh"];
      if (codeExtensions.includes(ext) || type.includes("javascript") || type.includes("typescript") || type.includes("json")) {
        return [
          { id: "debug", label: "Debug Code", desc: "Identify bugs & trace errors" },
          { id: "optimize", label: "Optimize Code", desc: "Refactor for speed/complexity" },
          { id: "explain_code", label: "Explain Code", desc: "Explain logic step-by-step" },
          ...defaultActions
        ];
      }

      if (type.startsWith("image/")) {
        return [
          { id: "analyze_image", label: "Analyze Visuals", desc: "Explain what is in this image" },
          { id: "ocr", label: "Extract Text", desc: "Perform OCR on image contents" }
        ];
      }

      return defaultActions;
    };

    return () => {
      if (!props.isOpen) return null;

      const actions = getActions();

      return (
        <>
          {/* Backdrop on mobile */}
          <div 
            onClick={() => props.onClose()}
            className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          <div 
            className="fixed md:absolute bottom-0 md:bottom-24 right-0 left-0 md:left-auto md:right-8 md:w-96 z-[60] md:z-40 rounded-t-3xl md:rounded-2xl border-x-0 border-b-0 border-t md:border border-blue-500/25 bg-[#050914]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,102,255,0.15)] flex flex-col max-h-[80vh] md:max-h-[500px] overflow-hidden transition-all duration-300 font-orbitron"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-zinc-950/40 select-none">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest text-zinc-100 uppercase">
                  File Workspace
                </span>
              </div>
              <button
                onClick={() => props.onClose()}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
              
              {/* State 1: No File Attached */}
              {!props.uploadedFile ? (
                <div 
                  onClick={() => props.onUploadClick()}
                  className="flex-1 min-h-[200px] rounded-xl border border-dashed border-white/10 hover:border-blue-500/30 bg-zinc-950/20 hover:bg-blue-500/5 transition-all p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 group-hover:border-blue-500/30 flex items-center justify-center transition-all">
                    <Paperclip className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-zinc-300 group-hover:text-white">
                      ATTACH FILE TO OS CORE
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono-tech mt-1 leading-normal max-w-[200px] mx-auto">
                      Supports PDF, DOCX, ZIP, Code, SQL, and Images (Max 50MB)
                    </div>
                  </div>
                </div>
              ) : (
                /* State 2: File Attached */
                <div className="flex flex-col gap-4 min-h-0 flex-1">
                  
                  {/* File Metadata Card */}
                  <div className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/20 text-blue-400 flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-zinc-200 truncate font-orbitron">
                          {props.uploadedFile.name}
                        </div>
                        <div className="text-[8.5px] text-zinc-500 font-mono-tech mt-0.5 uppercase">
                          {formatSize(props.uploadedFile.size)} • {props.uploadedFile.type.split("/")[1] || props.uploadedFile.type}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => props.onRemoveFile()}
                      className="p-2 text-zinc-500 hover:text-blue-400 rounded hover:bg-white/5 transition-all cursor-pointer flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Detach File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scrollable File Preview (if text content exists) */}
                  {props.uploadedFile.text && (
                    <div className="flex-1 min-h-[100px] flex flex-col gap-1.5 min-h-0">
                      <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest">
                        Extracted Text/Code Preview
                      </span>
                      <div className="flex-1 overflow-auto rounded-lg border border-white/5 bg-zinc-950/60 p-3 scrollbar-thin">
                        <pre className="text-[9px] text-zinc-300 font-mono-tech leading-relaxed whitespace-pre-wrap">
                          {props.uploadedFile.text}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Shortcuts */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" /> Choose Analysis Action
                    </span>
                    <div className="grid grid-cols-2 gap-2 max-h-[130px] overflow-y-auto pr-1">
                      {actions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => props.onSelectAction(act.id)}
                          className="w-full text-left p-2 rounded-lg bg-zinc-950/20 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex items-center justify-between cursor-pointer min-h-[38px] group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[9px] font-bold text-zinc-300 group-hover:text-blue-400 truncate">
                              {act.label}
                            </div>
                            <div className="text-[7.5px] text-zinc-500 font-mono-tech mt-0.5 truncate leading-none">
                              {act.desc}
                            </div>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-blue-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-2 border-t border-white/5 bg-zinc-950/80 text-[7.5px] font-bold text-zinc-600 uppercase tracking-widest font-mono-tech select-none">
              Workspace memory loaded • Prometheus OS
            </div>
          </div>
        </>
      );
    };
  },
});
