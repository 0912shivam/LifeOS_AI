"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { UserProfile } from '../lib/types';
import { Sidebar, navItems } from './sidebar';
import { Topbar } from './topbar';

export function DashboardShell({ user, children }: { user?: UserProfile; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 xl:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-xl xl:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">LifeOS AI</p>
              <p className="text-sm font-semibold text-white">Dashboard</p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap pr-2">
                {navItems.slice(0, 6).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Topbar name={user?.name} />
        {children}
      </div>
    </div>
  );
}