"use client";

import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 dark:text-slate-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}