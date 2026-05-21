"use client";

import { ModeToggle } from './mode-toggle';

export function Topbar({ name = 'Avery' }: { name?: string }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300/80">LifeOS control center</p>
        <h2 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-white sm:text-3xl">Good to see you, {name}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
          Week 21 · 2026
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}