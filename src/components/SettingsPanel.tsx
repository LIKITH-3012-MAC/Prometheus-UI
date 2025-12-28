export default function SettingsPanel({ open, onClose }: any) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-[320px] bg-[#0b0b0b] border-l border-zinc-800 p-6 transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">
          Settings
        </h2>

        <ul className="text-xs text-zinc-500 space-y-2">
          <li>⌘ + Enter → Send</li>
          <li>⌘ + K → Settings</li>
          <li>⌘ + ⇧ + C → Clear Chat</li>
        </ul>
      </aside>
    </div>
  );
}
