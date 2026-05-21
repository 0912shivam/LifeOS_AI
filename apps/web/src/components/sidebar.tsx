"use client";

import Link from 'next/link';
import { BarChart3, BrainCircuit, CalendarDays, CircleDollarSign, Goal, LayoutDashboard, LogOut, MenuSquare, NotebookPen, Sparkles, TimerReset } from 'lucide-react';
import { motion } from 'framer-motion';

export const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Goals', href: '/dashboard#goals', icon: Goal },
  { label: 'Habits', href: '/dashboard#habits', icon: TimerReset },
  { label: 'Expenses', href: '/dashboard#expenses', icon: CircleDollarSign },
  { label: 'Study', href: '/dashboard#study', icon: NotebookPen },
  { label: 'Analytics', href: '/dashboard#analytics', icon: BarChart3 },
  { label: 'Calendar', href: '/dashboard#calendar', icon: CalendarDays },
  { label: 'AI Insights', href: '/dashboard#insights', icon: BrainCircuit }
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-80 flex-shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-slate-950/85 p-6 backdrop-blur-xl xl:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300 shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">LifeOS AI</p>
          <h1 className="text-lg font-semibold text-white">Personal command center</h1>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-4 w-4 text-brand-300 transition group-hover:scale-110" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="mb-2 font-semibold text-white">Focus mode</p>
        <p>AI monitors goals, habits, spending, and study signals in one view.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-brand-400">
          <MenuSquare className="h-4 w-4" />
          Open quick actions
        </button>
        <button className="mt-3 inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}