import { defineComponent, ref, watch, onMounted } from "vue";
import { Mic, Paperclip, Send, Sparkles } from "lucide-vue-next";

export default defineComponent({
  name: "PromptComposer",
  props: {
    modelValue: { type: String, required: true },
    isListening: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    onSend: { type: Function, required: true },
    onToggleVoice: { type: Function, required: true },
    onOpenFeatures: { type: Function, required: true },
  },
  emits: ["update:modelValue", "file-uploaded"],
  setup(props, { emit }) {
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const uploadingFile = ref(false);

    const adjustHeight = () => {
      const textarea = textareaRef.value;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    };

    watch(() => props.modelValue, adjustHeight);
    onMounted(adjustHeight);

    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      emit("update:modelValue", target.value);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        props.onSend();
      }
    };

    const triggerFileInput = () => {
      fileInputRef.value?.click();
    };

    const handleFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const file = target.files[0];
      uploadingFile.value = true;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/parse-file", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Parser failure");

        const data = await res.json();
        // Emit file uploaded event
        emit("file-uploaded", data);
      } catch (err) {
        console.error(err);
        alert("Failed to process file. Ensure backend is active.");
      } finally {
        uploadingFile.value = false;
        // Reset file input value
        target.value = "";
      }
    };

    return () => (
      <div className="w-full flex flex-col gap-2 bg-zinc-950/40 p-4 border-t border-white/5 backdrop-blur-2xl select-none">
        <div className="max-w-4xl w-full mx-auto prompt-composer-container font-orbitron">
          
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="prometheus-file-input"
          />

          {/* File Button */}
          <button
            onClick={triggerFileInput}
            disabled={props.disabled || uploadingFile.value}
            className={`composer-file p-3.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0 cursor-pointer flex items-center justify-center ${
              uploadingFile.value ? "animate-pulse border-blue-500/30 text-blue-400" : ""
            }`}
            title="Upload any file type (PDF, DOCX, ZIP, Code, Image, SQL)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Features Button */}
          <button
            onClick={() => props.onOpenFeatures()}
            disabled={props.disabled}
            className="composer-features px-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 hover:text-blue-400 hover:border-blue-500/30 hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold font-orbitron"
            title="Open Features Drawer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FEATURES</span>
          </button>

          {/* Textarea Container */}
          <div className="composer-input flex-1 glass-panel border border-white/5 focus-within:border-blue-500/50 rounded-2xl flex items-center px-4 py-1.5 bg-black/40">
            <textarea
              ref={textareaRef}
              rows={1}
              value={props.modelValue}
              onInput={handleInput}
              onKeydown={handleKeyDown}
              placeholder={uploadingFile.value ? "Parsing uploaded file..." : "Ask Prometheus anything..."}
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm py-2 px-1 resize-none caret-blue-400 placeholder:text-zinc-600 font-medium leading-relaxed max-h-[120px]"
              disabled={props.disabled || uploadingFile.value}
            />
          </div>

          {/* Voice Button */}
          <button
            onClick={() => props.onToggleVoice()}
            className={`composer-voice p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer flex-shrink-0 flex items-center justify-center ${
              props.isListening
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse scale-105"
                : "bg-zinc-900 border border-white/5 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/5 hover:border-blue-500/20"
            }`}
            title={props.isListening ? "Mute speech engine" : "Start Voice command"}
          >
            <Mic className="w-4 h-4" />
            {props.isListening && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
            )}
          </button>

          {/* Send Button */}
          <button
            onClick={() => props.onSend()}
            disabled={props.disabled || !props.modelValue.trim() || uploadingFile.value}
            className={`composer-send p-4 rounded-xl font-bold font-orbitron transition-all shadow-xl flex-shrink-0 flex items-center justify-center cursor-pointer ${
              props.disabled || !props.modelValue.trim() || uploadingFile.value
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed scale-95"
                : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,102,255,0.25)]"
            }`}
            title="Execute Command"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>
        <div className="text-[7.5px] text-center text-zinc-700 tracking-[0.4em] font-black uppercase select-none mt-1 font-orbitron">
          Prometheus Command Node Synced • L.Naidu Systems
        </div>
      </div>
    );
  },
});
