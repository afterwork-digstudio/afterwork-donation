"use strict";
"use client";

import React from "react";
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenSimulator: () => void;
}

export default function DashboardHeader({
  onToggleMobileMenu,
  onOpenSimulator,
}: HeaderProps) {
  const [isDark, setIsDark] = React.useState(false);

  // Toggle theme mode
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("donation-hub-theme", "light");
    } else {
      html.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("donation-hub-theme", "dark");
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("donation-hub-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:px-6">
      {/* Left: Mobile button + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="size-4" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Dashboard
          </span>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/60 text-foreground font-semibold">
            <Layers className="size-3.5 text-indigo-500" />
            Providers
          </span>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Status indicator */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Roblox Live Sync Active</span>
        </div>

        {/* Simulator Button */}
        <button
          type="button"
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors shadow-xs"
        >
          <Sparkles className="size-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Simulasi Webhook</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Ganti Tema Terang/Gelap"
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {isDark ? (
            <Sun className="size-4 text-amber-400" />
          ) : (
            <Moon className="size-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}
