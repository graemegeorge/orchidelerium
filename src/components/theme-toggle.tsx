"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className = "" }) => {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  React.useEffect(() => {
    const stored = localStorage.getItem("canopy-theme");
    const initial =
      stored === "dark" || stored === "light"
        ? stored
        : (document.documentElement.dataset.theme as "dark" | "light") ||
          "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("canopy-theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "px-4 py-2 rounded-lg border border-[var(--border)] text-xs tracking-[0.18em] capitalize",
        "bg-[var(--bg-elev)]/80 hover:bg-[var(--bg-elev)] transition-colors",
        className
      )}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
};
