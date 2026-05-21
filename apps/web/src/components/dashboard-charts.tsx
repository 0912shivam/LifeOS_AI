"use client";

import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from './ui/card';

export function GoalCompletionChart({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Goal completion</p>
          <h3 className="text-lg font-semibold text-white">Completion trend</h3>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#13ad86" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#13ad86" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)' }} />
            <Area type="monotone" dataKey="value" stroke="#13ad86" fill="url(#progressFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function HabitConsistencyChart({ data }: { data: Array<{ day: string; value: number }> }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">Weekly habit analytics</p>
      <h3 className="mb-4 text-lg font-semibold text-white">Consistency trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)' }} />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function ExpenseBreakdownChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const colors = ['#13ad86', '#0ea5e9', '#f59e0b', '#f97316', '#8b5cf6'];

  return (
    <Card>
      <p className="text-sm text-slate-400">Expense breakdown</p>
      <h3 className="mb-4 text-lg font-semibold text-white">Spending distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function StudyProductivityChart({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <Card>
      <p className="text-sm text-slate-400">Study productivity</p>
      <h3 className="mb-4 text-lg font-semibold text-white">Subject progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="studyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.08)' }} />
            <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#studyFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}