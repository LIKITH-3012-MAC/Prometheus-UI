import { useEffect } from "react";

export function useKeyboard({ sendMessage, toggleSettings, clearChat }: any) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "Enter") sendMessage();
      if (e.metaKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSettings();
      }
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        clearChat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
