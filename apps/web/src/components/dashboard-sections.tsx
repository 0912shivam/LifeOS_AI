"use client";

import type { DashboardPayload } from '../lib/types';
import { BrainCircuit, TriangleAlert } from 'lucide-react';
import { Card } from './ui/card';

export function CalendarSection({ events }: { events: DashboardPayload['calendar'] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Calendar</p>
          <h3 className="text-lg font-semibold text-white">Upcoming milestones</h3>
        </div>
      </div>
      <div className="space-y-3">
        {events && events.length > 0 ? (
          events.map((event) => (
            <div key={`${event.date}-${event.label}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">{event.label}</span>
              <span className="text-sm text-brand-300">{event.date}</span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No upcoming deadlines yet.
          </div>
        )}
      </div>
    </Card>
  );
}

export function RecommendationsSection({ items }: { items: string[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">AI insights</p>
          <h3 className="text-lg font-semibold text-white">Next best actions</h3>
        </div>
        <BrainCircuit className="h-5 w-5 text-brand-300" />
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} className="rounded-2xl border border-brand-400/15 bg-brand-500/10 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
            <TriangleAlert className="h-4 w-4 text-amber-300" />
            No insights yet. Add some goals, habits, expenses, or study tasks to generate recommendations.
          </div>
        )}
      </div>
    </Card>
  );
}