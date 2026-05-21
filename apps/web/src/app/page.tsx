import Link from 'next/link';
import { ArrowRight, BrainCircuit, CircleDollarSign, Goal, LayoutDashboard, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';

const pillars = [
  { title: 'Goals', description: 'Track yearly, monthly, and weekly goals with milestones.', icon: Goal },
  { title: 'Habits', description: 'Daily completion, streaks, and weekly analytics in one flow.', icon: Sparkles },
  { title: 'Expenses', description: 'Budget categories, monthly alerts, and spending charts.', icon: CircleDollarSign },
  { title: 'AI Insights', description: 'Predict risks and recommend what to do next.', icon: BrainCircuit }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <span className="text-sm uppercase tracking-[0.35em] text-slate-400">LifeOS AI</span>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400">
            Enter dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-sm text-brand-200">A personal operating system for your life</p>
            <h1 className="max-w-4xl font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Manage goals, habits, money, study, and productivity in one dashboard.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              LifeOS AI combines clean workflows, analytics, and contextual recommendations so you can focus on the next action instead of juggling five different tools.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-400">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Open dashboard <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <Card className="grid gap-4 p-6 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <Icon className="mb-4 h-6 w-6 text-brand-300" />
                  <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{pillar.description}</p>
                </div>
              );
            })}
          </Card>
        </section>
      </div>
    </main>
  );
}