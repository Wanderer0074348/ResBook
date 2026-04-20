"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  { key: "?", description: "Show this help", action: () => {} },
  { key: "s", description: "Focus search", action: () => {} },
  { key: "t", description: "Go to tools", action: () => {} },
  { key: "w", description: "Go to workflows", action: () => {} },
  { key: "d", description: "Go to dotfiles", action: () => {} },
  { key: "h", description: "Go to home", action: () => {} },
  { key: "c", description: "Go to collections", action: () => {} },
  { key: "g then c", description: "Go to collections", action: () => {} },
  { key: "g then h", description: "Go to home", action: () => {} },
  { key: "Escape", description: "Close dialog", action: () => {} },
  { key: "j/k", description: "Navigate up/down", action: () => {} },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }

      const key = e.key.toLowerCase();
      
      if (e.key === "s") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
      }
      if (key === "t") router.push("/tools");
      if (key === "w") router.push("/workflows");
      if (key === "d") router.push("/dotfiles");
      if (key === "h") router.push("/");
      if (key === "c") router.push("/collections");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-sm font-mono">{shortcut.key}</kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500">Press ? anytime to show this help</p>
      </div>
    </div>
  );
}
