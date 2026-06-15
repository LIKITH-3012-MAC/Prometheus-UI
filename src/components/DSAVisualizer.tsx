import { defineComponent, ref, onUnmounted, watch } from "vue";
import { Play, Pause, SkipForward, RotateCcw, X, Code2, Layers, Binary } from "lucide-vue-next";

export default defineComponent({
  name: "DSAVisualizer",
  props: {
    isOpen: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
  },
  setup(props) {
    const activeTab = ref("sort"); // "sort" | "stack" | "bst"
    
    // Bubble Sort State
    const array = ref<number[]>([45, 12, 85, 32, 70, 22, 60, 15]);
    const originalArray = [45, 12, 85, 32, 70, 22, 60, 15];
    const compareIdx = ref<number[]>([]);
    const sortedCount = ref(0);
    const bubbleI = ref(0);
    const bubbleJ = ref(0);
    const isPlaying = ref(false);
    const playSpeed = ref(800);
    const explanation = ref("Initialize array. Click 'Play' or 'Step' to trace execution.");
    let timerId: number | null = null;

    // Stack State
    const stack = ref<number[]>([42, 18, 73]);
    const maxStackSize = 5;

    // BST State
    const bstValues = ref<number[]>([50, 30, 70]);
    const bstInput = ref<number>(40);

    const resetSort = () => {
      array.value = [...originalArray];
      compareIdx.value = [];
      sortedCount.value = 0;
      bubbleI.value = 0;
      bubbleJ.value = 0;
      explanation.value = "Array reset. Click 'Play' or 'Step' to trace execution.";
      stopPlay();
    };

    const stepSort = () => {
      const n = array.value.length;
      if (bubbleI.value >= n - 1) {
        isPlaying.value = false;
        explanation.value = "Sorting complete! Time Complexity: O(N^2), Space Complexity: O(1).";
        compareIdx.value = [];
        return;
      }

      const j = bubbleJ.value;
      const i = bubbleI.value;
      compareIdx.value = [j, j + 1];
      explanation.value = `Comparing index ${j} (${array.value[j]}) and ${j + 1} (${array.value[j + 1]})`;

      if (array.value[j] > array.value[j + 1]) {
        // Swap
        const temp = array.value[j];
        array.value[j] = array.value[j + 1];
        array.value[j + 1] = temp;
        explanation.value += ` -> Swapped because ${temp} > ${array.value[j]}.`;
      } else {
        explanation.value += ` -> No swap needed.`;
      }

      bubbleJ.value++;
      if (bubbleJ.value >= n - 1 - i) {
        bubbleJ.value = 0;
        bubbleI.value++;
        sortedCount.value++;
      }
    };

    const startPlay = () => {
      if (isPlaying.value) return;
      isPlaying.value = true;
      timerId = window.setInterval(() => {
        stepSort();
        if (!isPlaying.value) {
          stopPlay();
        }
      }, playSpeed.value);
    };

    const stopPlay = () => {
      isPlaying.value = false;
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const togglePlay = () => {
      if (isPlaying.value) {
        stopPlay();
      } else {
        startPlay();
      }
    };

    // Stack Actions
    const pushStack = () => {
      if (stack.value.length >= maxStackSize) {
        alert("Stack Overflow! Maximum capacity reached.");
        return;
      }
      const val = Math.floor(Math.random() * 90) + 10;
      stack.value.push(val);
    };

    const popStack = () => {
      if (stack.value.length === 0) {
        alert("Stack Underflow! Stack is empty.");
        return;
      }
      stack.value.pop();
    };

    // BST Actions
    const insertBST = () => {
      if (!bstInput.value || bstValues.value.includes(bstInput.value)) return;
      if (bstValues.value.length >= 7) {
        alert("BST visualization limited to 3 levels (7 nodes max).");
        return;
      }
      bstValues.value.push(bstInput.value);
      bstInput.value = Math.floor(Math.random() * 90) + 10;
    };

    onUnmounted(() => {
      stopPlay();
    });

    return () => {
      if (!props.isOpen) return null;

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
                <Code2 className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest text-zinc-100 uppercase">
                  DSA Visualizer
                </span>
              </div>
              <button
                onClick={() => props.onClose()}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-white/5 bg-black/20 p-1">
              {[
                { id: "sort", label: "Sort", icon: Code2 },
                { id: "stack", label: "Stack", icon: Layers },
                { id: "bst", label: "BST", icon: Binary },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      stopPlay();
                      activeTab.value = tab.id;
                    }}
                    className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab.value === tab.id
                        ? "bg-blue-950/40 border border-blue-500/30 text-blue-400"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Workspace Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
              
              {/* Tab 1: Bubble Sort */}
              {activeTab.value === "sort" && (
                <div className="flex flex-col gap-4">
                  {/* Bars Container */}
                  <div className="h-32 bg-zinc-950/40 border border-white/5 rounded-xl p-4 flex items-end justify-between gap-1">
                    {array.value.map((val, idx) => {
                      const isComparing = compareIdx.value.includes(idx);
                      return (
                        <div 
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-1.5 transition-all duration-300"
                        >
                          <span className={`text-[8px] font-mono-tech ${isComparing ? "text-blue-400 font-bold" : "text-zinc-500"}`}>
                            {val}
                          </span>
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              isComparing 
                                ? "bg-blue-500 shadow-[0_0_12px_rgba(0,102,255,0.6)]" 
                                : "bg-blue-950/60 border border-blue-900/40"
                            }`}
                            style={{ height: `${(val / 90) * 80}px` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bubble Sort Controls */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={togglePlay}
                        className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 cursor-pointer flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,102,255,0.2)] min-h-[40px] min-w-[40px]"
                      >
                        {isPlaying.value ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={stepSort}
                        disabled={isPlaying.value}
                        className="p-2.5 rounded-lg border border-white/5 bg-zinc-950/30 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer flex items-center justify-center transition-all min-h-[40px] min-w-[40px]"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                      <button
                        onClick={resetSort}
                        className="p-2.5 rounded-lg border border-white/5 bg-zinc-950/30 text-zinc-400 hover:text-white cursor-pointer flex items-center justify-center transition-all min-h-[40px] min-w-[40px]"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[8px] font-mono-tech text-zinc-500 flex flex-col items-end uppercase">
                      <span>Speed: {playSpeed.value}ms</span>
                      <input 
                        type="range" 
                        min="200" 
                        max="1500" 
                        value={playSpeed.value}
                        onInput={(e) => {
                          playSpeed.value = Number((e.target as HTMLInputElement).value);
                          if (isPlaying.value) {
                            stopPlay();
                            startPlay();
                          }
                        }}
                        className="w-20 mt-1 cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Stack Operations */}
              {activeTab.value === "stack" && (
                <div className="flex flex-col gap-4">
                  {/* Stack visualization area */}
                  <div className="h-32 bg-zinc-950/40 border border-white/5 rounded-xl p-4 flex flex-col-reverse justify-start items-center gap-1.5 overflow-y-auto">
                    {stack.value.length === 0 ? (
                      <div className="text-[10px] text-zinc-600 my-auto uppercase font-mono-tech">
                        Empty Stack (Underflow)
                      </div>
                    ) : (
                      stack.value.map((val, idx) => (
                        <div 
                          key={idx}
                          className="w-32 py-1.5 rounded-lg border border-blue-500/20 bg-blue-950/20 text-center text-[10px] font-mono-tech text-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.05)] animate-in slide-in-from-bottom-2 duration-200"
                        >
                          {val} {idx === stack.value.length - 1 && "← TOP"}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={pushStack}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(0,102,255,0.2)] min-h-[40px]"
                    >
                      Push Random
                    </button>
                    <button
                      onClick={popStack}
                      className="flex-1 py-2 rounded-lg border border-white/5 bg-zinc-950/30 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer min-h-[40px]"
                    >
                      Pop
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: BST Tree */}
              {activeTab.value === "bst" && (
                <div className="flex flex-col gap-4">
                  {/* BST tree renderer */}
                  <div className="h-32 bg-zinc-950/40 border border-white/5 rounded-xl p-4 flex flex-col justify-around items-center select-none relative">
                    {bstValues.value.length === 0 ? (
                      <div className="text-[10px] text-zinc-600 uppercase font-mono-tech">No Nodes</div>
                    ) : (
                      <div className="w-full flex flex-col items-center gap-4">
                        {/* Root */}
                        <div className="w-8 h-8 rounded-full border border-blue-500 bg-blue-950/30 flex items-center justify-center text-[9px] font-mono-tech text-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.2)] z-10">
                          {bstValues.value[0]}
                        </div>
                        {/* Level 1 Children */}
                        <div className="w-full flex justify-around px-8 relative">
                          <div className="absolute top-[-15px] left-[25%] right-[25%] h-0.5 border-t border-dashed border-white/10" />
                          {bstValues.value.slice(1, 3).map((val, idx) => (
                            <div 
                              key={idx}
                              className="w-8 h-8 rounded-full border border-blue-500/40 bg-zinc-950/60 flex items-center justify-center text-[9px] font-mono-tech text-zinc-300 animate-in zoom-in duration-200"
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Insert Box */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={bstInput.value}
                      onInput={(e) => (bstInput.value = Number((e.target as HTMLInputElement).value))}
                      className="w-20 px-2 py-2 rounded-lg border border-white/5 bg-zinc-950/40 text-[10px] text-center text-white outline-none font-mono-tech focus:border-blue-500/50 min-h-[40px]"
                    />
                    <button
                      onClick={insertBST}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(0,102,255,0.2)] min-h-[40px]"
                    >
                      Insert Node
                    </button>
                  </div>
                </div>
              )}

              {/* Status/Explanation Area */}
              <div className="p-3.5 rounded-lg border border-white/5 bg-black/40">
                <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                  Tracing Log / Concept
                </span>
                <p className="text-[9.5px] text-zinc-300 font-mono-tech leading-relaxed">
                  {activeTab.value === "sort" && explanation.value}
                  {activeTab.value === "stack" && (
                    `Current Size: ${stack.value.length} / ${maxStackSize}. Stack functions in a LIFO pattern (Last In First Out). Push adds to the top; Pop removes from the top.`
                  )}
                  {activeTab.value === "bst" && (
                    `Nodes present: [${bstValues.value.join(", ")}]. BST rule: Left child < parent < right child. Insertion average complexity: O(log N).`
                  )}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-2 border-t border-white/5 bg-zinc-950/80 text-[7.5px] font-bold text-zinc-600 uppercase tracking-widest font-mono-tech select-none">
              Node Execution Sandbox • Prometheus Core
            </div>
          </div>
        </>
      );
    };
  },
});
