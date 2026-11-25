"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return { dark: theme === "dark", toggle };
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`glass-press flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5 ${className}`}
    >
      {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
    </button>
  );
}

export function ThemeRow() {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      className="flex min-h-14 w-full items-center justify-between text-left text-lg"
    >
      <span>Dark mode</span>
      <span
        aria-hidden
        className={`relative h-8 w-14 rounded-full transition-colors motion-reduce:transition-none ${
          dark ? "bg-btn" : "bg-ink/15"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-card shadow transition-transform motion-reduce:transition-none ${
            dark ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}
