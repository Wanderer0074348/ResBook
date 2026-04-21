"use client";

import { useState, useEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

const THEME_KEY = "resbook-theme";

interface ThemeOption {
  id: Theme;
  label: string;
  icon: typeof Sun;
}

const themes: ThemeOption[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeSelector({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    if (stored && themes.some((t) => t.id === stored)) {
      setTheme(stored);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    if (newTheme === "system") {
      document.documentElement.classList.remove("light", "dark");
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    }
  };

  if (!isClient) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {themes.map((t) => (
          <div
            key={t.id}
            className="w-8 h-8 border border-gray-300 dark:border-gray-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {themes.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => changeTheme(t.id)}
            className={`w-8 h-8 flex items-center justify-center border transition-colors ${
              theme === t.id
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
            title={t.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
}