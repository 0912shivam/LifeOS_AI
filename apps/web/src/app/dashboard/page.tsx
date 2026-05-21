"use client";

import type { ReactNode, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, RefreshCw, Sparkles, Trash2, TrendingUp } from 'lucide-react';
import { DashboardShell } from '../../components/dashboard-shell';
import { Card } from '../../components/ui/card';
import { MetricCard } from '../../components/metric-card';
import { CalendarSection, RecommendationsSection } from '../../components/dashboard-sections';
import { GoalCompletionChart, HabitConsistencyChart, ExpenseBreakdownChart, StudyProductivityChart } from '../../components/dashboard-charts';
import {
  createExpense,
  createGoal,
  createHabit,
  createStudyTask,
  deleteExpense,
  deleteGoal,
  deleteHabit,
  deleteStudyTask,
  getDashboard,
  getInsights,
  InsightsResponse,
  updateExpense,
  updateGoal,
  updateHabit,
  updateStudyTask
} from '../../lib/api';
import { DashboardPayload, Expense, Goal, Habit, StudyTask, UserProfile } from '../../lib/types';

type MutationState = { key: string | null; loading: boolean; error: string };

const fallbackUser: UserProfile = {
  id: 'demo-user-1',
  name: 'Avery Johnson',
  email: 'demo@lifeos.ai',
  role: 'user',
  preferences: { theme: 'dark', currency: 'USD' }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const buildMilestones = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((title) => ({ title, completed: false }));

const FieldShell = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="space-y-2 text-sm text-slate-300">
    <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">{label}</span>
    {children}
  </label>
);

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(fallbackUser);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mutation, setMutation] = useState<MutationState>({ key: null, loading: false, error: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('lifeos-token');
    const storedUser = localStorage.getItem('lifeos-user');

    setToken(storedToken);

    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserProfile);
    }
  }, []);

  const refreshData = async (activeToken = token) => {
    setLoading(true);
    setError('');

    try {
      const [summary, insightPayload] = await Promise.all([getDashboard(activeToken || undefined), getInsights(activeToken || undefined)]);
      setDashboard(summary);
      setInsights(insightPayload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
  }, [token]);

  const setBusy = (key: string | null, loadingState: boolean, message = '') => {
    setMutation({ key, loading: loadingState, error: message });
  };

  const runMutation = async (key: string, action: () => Promise<unknown>) => {
    if (!token) {
      setMutation({ key: null, loading: false, error: 'Sign in to save changes.' });
      return;
    }

    setBusy(key, true, '');

    try {
      await action();
      await refreshData(token);
      setBusy(null, false, '');
    } catch (mutationError) {
      setMutation({ key: null, loading: false, error: mutationError instanceof Error ? mutationError.message : 'Update failed' });
    }
  };

  const summary = dashboard;
  const goals = summary?.goals ?? [];
  const habits = summary?.habits ?? [];
  const expenses = summary?.expenses ?? [];
  const studyTasks = summary?.studyTasks ?? [];

  const goalProgressData = goals.map((goal) => ({ label: goal.title.slice(0, 10), value: goal.progress }));
  const habitConsistencyData = habits.map((habit) => ({
    day: habit.title.split(' ')[0].slice(0, 8),
    value: habit.history.length > 0 ? Math.round((habit.history.filter(Boolean).length / habit.history.length) * 100) : 0
  }));
  const studyProductivityData = studyTasks.map((task) => ({ label: task.subject.slice(0, 10), value: task.progress }));

  const updateGoalProgress = (goal: Goal, delta: number) =>
    runMutation(`goal-${goal.id}`, async () => {
      const nextProgress = Math.max(0, Math.min(100, goal.progress + delta));
      await updateGoal(token!, goal.id, { progress: nextProgress });
    });

  const updateHabitStreak = (habit: Habit, delta: number) =>
    runMutation(`habit-${habit.id}`, async () => {
      const nextStreak = Math.max(0, habit.streak + delta);
      const nextHistory = [...habit.history, delta > 0];
      await updateHabit(token!, habit.id, { streak: nextStreak, history: nextHistory });
    });

  const updateExpenseAmount = (expense: Expense, delta: number) =>
    runMutation(`expense-${expense.id}`, async () => {
      const nextAmount = Math.max(0, Number((expense.amount + delta).toFixed(2)));
      await updateExpense(token!, expense.id, { amount: nextAmount });
    });

  const updateStudyProgress = (task: StudyTask, delta: number) =>
    runMutation(`study-${task.id}`, async () => {
      const nextProgress = Math.max(0, Math.min(100, task.progress + delta));
      await updateStudyTask(token!, task.id, { progress: nextProgress });
    });

  const handleCreateGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runMutation('create-goal', async () => {
      await createGoal(token!, {
        title: String(formData.get('title') || ''),
        description: String(formData.get('description') || ''),
        timeframe: String(formData.get('timeframe') || 'monthly') as Goal['timeframe'],
        progress: Number(formData.get('progress') || 0),
        milestones: buildMilestones(String(formData.get('milestones') || '')),
        dueDate: formData.get('dueDate') ? new Date(String(formData.get('dueDate'))).toISOString() : undefined
      });
    });

    form.reset();
  };

  const handleCreateHabit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runMutation('create-habit', async () => {
      await createHabit(token!, {
        title: String(formData.get('title') || ''),
        frequency: String(formData.get('frequency') || 'daily'),
        streak: Number(formData.get('streak') || 0),
        history: [],
        color: String(formData.get('color') || '#13ad86')
      });
    });

    form.reset();
  };

  const handleCreateExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runMutation('create-expense', async () => {
      await createExpense(token!, {
        title: String(formData.get('title') || ''),
        amount: Number(formData.get('amount') || 0),
        type: String(formData.get('type') || 'expense') as Expense['type'],
        category: String(formData.get('category') || 'general'),
        date: new Date(String(formData.get('date') || new Date().toISOString())).toISOString(),
        notes: String(formData.get('notes') || '')
      });
    });

    form.reset();
  };

  const handleCreateStudyTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await runMutation('create-study', async () => {
      await createStudyTask(token!, {
        subject: String(formData.get('subject') || ''),
        deadline: new Date(String(formData.get('deadline') || new Date().toISOString())).toISOString(),
        progress: Number(formData.get('progress') || 0),
        examReminderAt: formData.get('examReminderAt') ? new Date(String(formData.get('examReminderAt'))).toISOString() : undefined,
        notes: String(formData.get('notes') || '')
      });
    });

    form.reset();
  };

  return (
    <DashboardShell user={user}>
      <main className="flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(19,173,134,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(2,6,23,1))] px-4 py-5 md:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-200">
                <Sparkles className="h-3.5 w-3.5" />
                LifeOS AI dashboard
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold text-white md:text-4xl">Your life system, live and synced with MongoDB.</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">Track goals, habits, expenses, and study work from one workspace. Create, update, and delete directly from the dashboard, then refresh the same live data from the backend.</p>
            </div>
            <button
              type="button"
              onClick={() => refreshData(token || undefined)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-400/30 hover:bg-brand-500/10"
            >
              <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Refresh
            </button>
          </div>

          {(error || mutation.error) && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error || mutation.error}</div>
          )}

          {loading && !summary ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Goals" value={summary?.cards.goals ?? 0} note="Active goals in flight" />
              <MetricCard label="Habits" value={summary?.cards.habits ?? 0} note="Tracked daily routines" />
              <MetricCard label="Expenses" value={summary?.cards.expenses ?? 0} note="Live financial entries" />
              <MetricCard label="Study tasks" value={summary?.cards.studyTasks ?? 0} note="Deadlines and reminders" />
            </section>
          )}

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <GoalCompletionChart data={goalProgressData} />
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">AI insights</p>
                  <h3 className="text-lg font-semibold text-white">Adaptive recommendations</h3>
                </div>
                <TrendingUp className="h-5 w-5 text-brand-300" />
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {(insights?.insights ?? summary?.aiInsights ?? []).map((item) => (
                  <p key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-6">{item}</p>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-3" id="analytics">
            <HabitConsistencyChart data={habitConsistencyData} />
            <ExpenseBreakdownChart data={summary?.monthlySpending ?? []} />
            <StudyProductivityChart data={studyProductivityData} />
          </section>

          <section className="grid gap-6 xl:grid-cols-3" id="calendar">
            <CalendarSection events={summary?.calendar ?? []} />
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Finances</p>
                  <h3 className="text-lg font-semibold text-white">Monthly snapshot</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"><span className="text-slate-400">Income</span><span className="text-emerald-300">{formatCurrency(insights?.finance?.incomeTotal ?? 0)}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"><span className="text-slate-400">Expenses</span><span className="text-rose-300">{formatCurrency(insights?.finance?.expenseTotal ?? 0)}</span></div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"><span className="text-slate-400">Net</span><span className="text-brand-300">{formatCurrency(insights?.finance?.netTotal ?? 0)}</span></div>
              </div>
            </Card>
            <RecommendationsSection items={insights?.recommendations ?? summary?.aiInsights ?? []} />
          </section>

          <section className="grid gap-6 xl:grid-cols-2" id="goals">
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Goals</p>
                  <h3 className="text-lg font-semibold text-white">Create and manage goals</h3>
                </div>
                <Plus className="h-5 w-5 text-brand-300" />
              </div>

              <form onSubmit={handleCreateGoal} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
                <FieldShell label="Title">
                  <input name="title" required placeholder="Finish portfolio launch" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                </FieldShell>
                <FieldShell label="Timeframe">
                  <select name="timeframe" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </FieldShell>
                <FieldShell label="Progress">
                  <input name="progress" type="number" min="0" max="100" defaultValue={0} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                </FieldShell>
                <FieldShell label="Due date">
                  <input name="dueDate" type="date" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                </FieldShell>
                <FieldShell label="Milestones">
                  <input name="milestones" placeholder="Design, Build, Ship" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                </FieldShell>
                <FieldShell label="Description">
                  <input name="description" placeholder="Short context for the goal" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                </FieldShell>
                <button type="submit" disabled={mutation.loading && mutation.key === 'create-goal'} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70">
                  {mutation.loading && mutation.key === 'create-goal' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add goal
                </button>
              </form>

              <div className="mt-5 space-y-3">
                {goals.length > 0 ? goals.map((goal) => (
                  <div key={goal.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{goal.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{goal.description || 'No description provided'}</p>
                      </div>
                      <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-200">{goal.timeframe}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-brand-400" style={{ width: `${goal.progress}%` }} /></div>
                    <p className="mt-2 text-xs text-slate-400">Progress {goal.progress}% {goal.dueDate ? `· Due ${goal.dueDate.slice(0, 10)}` : ''}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => updateGoalProgress(goal, 10)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-brand-500/10" disabled={mutation.loading}>
                        <Plus className="h-3.5 w-3.5" /> +10%
                      </button>
                      <button onClick={() => updateGoalProgress(goal, 100 - goal.progress)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-emerald-500/10" disabled={mutation.loading}>
                        Complete
                      </button>
                      <button onClick={() => runMutation(`delete-goal-${goal.id}`, () => deleteGoal(token!, goal.id))} className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/20" disabled={mutation.loading}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">No goals yet. Add one above to get started.</div>
                )}
              </div>
            </Card>

            <div className="space-y-6">
              <Card id="habits">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Habits</p>
                    <h3 className="text-lg font-semibold text-white">Track streaks and consistency</h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-brand-300" />
                </div>

                <form onSubmit={handleCreateHabit} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
                  <FieldShell label="Title">
                    <input name="title" required placeholder="Morning meditation" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Frequency">
                    <input name="frequency" placeholder="daily" defaultValue="daily" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Streak">
                    <input name="streak" type="number" min="0" defaultValue={0} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                  </FieldShell>
                  <FieldShell label="Color">
                    <input name="color" type="color" defaultValue="#13ad86" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-2" />
                  </FieldShell>
                  <button type="submit" disabled={mutation.loading && mutation.key === 'create-habit'} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70">
                    {mutation.loading && mutation.key === 'create-habit' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add habit
                  </button>
                </form>

                <div className="mt-5 space-y-3">
                  {habits.length > 0 ? habits.map((habit) => (
                    <div key={habit.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{habit.title}</p>
                          <p className="text-sm text-slate-400">{habit.frequency} · {habit.streak} day streak</p>
                        </div>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: habit.color }} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => updateHabitStreak(habit, 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-brand-500/10" disabled={mutation.loading}>
                          <Plus className="h-3.5 w-3.5" /> +1 streak
                        </button>
                        <button onClick={() => runMutation(`delete-habit-${habit.id}`, () => deleteHabit(token!, habit.id))} className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/20" disabled={mutation.loading}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">No habits yet. Add a habit above.</div>
                  )}
                </div>
              </Card>

              <Card id="expenses">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Expenses</p>
                    <h3 className="text-lg font-semibold text-white">Track income and spending</h3>
                  </div>
                  <TrendingUp className="h-5 w-5 text-brand-300" />
                </div>

                <form onSubmit={handleCreateExpense} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
                  <FieldShell label="Title">
                    <input name="title" required placeholder="Freelance invoice" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Amount">
                    <input name="amount" type="number" min="0" step="0.01" required placeholder="1200" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Type">
                    <select name="type" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </FieldShell>
                  <FieldShell label="Category">
                    <input name="category" required placeholder="food, bills, learning" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Date">
                    <input name="date" type="date" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                  </FieldShell>
                  <FieldShell label="Notes">
                    <input name="notes" placeholder="Optional context" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <button type="submit" disabled={mutation.loading && mutation.key === 'create-expense'} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70">
                    {mutation.loading && mutation.key === 'create-expense' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add expense
                  </button>
                </form>

                <div className="mt-5 space-y-3">
                  {expenses.length > 0 ? expenses.map((expense) => (
                    <div key={expense.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{expense.title}</p>
                          <p className="text-sm text-slate-400">{expense.category} · {new Date(expense.date).toLocaleDateString()}</p>
                          {expense.notes ? <p className="mt-1 text-xs text-slate-500">{expense.notes}</p> : null}
                        </div>
                        <span className={expense.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}>{expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => updateExpenseAmount(expense, 5)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-brand-500/10" disabled={mutation.loading}>
                          <Plus className="h-3.5 w-3.5" /> +$5
                        </button>
                        <button onClick={() => runMutation(`delete-expense-${expense.id}`, () => deleteExpense(token!, expense.id))} className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/20" disabled={mutation.loading}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">No expenses yet. Add a transaction above.</div>
                  )}
                </div>
              </Card>

              <Card id="study">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Study planner</p>
                    <h3 className="text-lg font-semibold text-white">Track deadlines and exam reminders</h3>
                  </div>
                  <Plus className="h-5 w-5 text-brand-300" />
                </div>

                <form onSubmit={handleCreateStudyTask} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
                  <FieldShell label="Subject">
                    <input name="subject" required placeholder="Advanced React" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <FieldShell label="Deadline">
                    <input name="deadline" type="date" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                  </FieldShell>
                  <FieldShell label="Progress">
                    <input name="progress" type="number" min="0" max="100" defaultValue={0} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                  </FieldShell>
                  <FieldShell label="Exam reminder">
                    <input name="examReminderAt" type="date" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
                  </FieldShell>
                  <FieldShell label="Notes">
                    <input name="notes" placeholder="Optional revision plan" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
                  </FieldShell>
                  <div />
                  <button type="submit" disabled={mutation.loading && mutation.key === 'create-study'} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70">
                    {mutation.loading && mutation.key === 'create-study' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add study task
                  </button>
                </form>

                <div className="mt-5 space-y-3">
                  {studyTasks.length > 0 ? studyTasks.map((task) => (
                    <div key={task.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{task.subject}</p>
                          <p className="text-sm text-slate-400">Deadline {new Date(task.deadline).toLocaleDateString()} · {task.examReminderAt ? `Reminder ${new Date(task.examReminderAt).toLocaleDateString()}` : 'No reminder set'}</p>
                          {task.notes ? <p className="mt-1 text-xs text-slate-500">{task.notes}</p> : null}
                        </div>
                        <span className="text-sm text-brand-300">{task.progress}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-sky-400" style={{ width: `${task.progress}%` }} /></div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => updateStudyProgress(task, 10)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-brand-500/10" disabled={mutation.loading}>
                          <Plus className="h-3.5 w-3.5" /> +10%
                        </button>
                        <button onClick={() => runMutation(`delete-study-${task.id}`, () => deleteStudyTask(token!, task.id))} className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/20" disabled={mutation.loading}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">No study tasks yet. Add one above.</div>
                  )}
                </div>
              </Card>
            </div>
          </section>
        </motion.div>
      </main>
    </DashboardShell>
  );
}