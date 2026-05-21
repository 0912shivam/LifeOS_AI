import { DashboardPayload, Expense, Goal, Habit, StudyTask, UserProfile } from './types';

export const demoProfile: UserProfile = {
  id: 'demo-user-1',
  name: 'Avery Johnson',
  email: 'demo@lifeos.ai',
  role: 'user',
  preferences: {
    theme: 'dark',
    currency: 'USD'
  }
};

export const goals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Run a 5K under 25 minutes',
    description: 'Build endurance and pace control.',
    timeframe: 'monthly',
    progress: 68,
    milestones: [
      { title: 'Complete 3 training runs per week', completed: true },
      { title: 'Hit 20 total weekly miles', completed: false }
    ],
    dueDate: '2026-08-01'
  },
  {
    id: 'goal-2',
    title: 'Launch personal portfolio',
    description: 'Publish case studies and contact page.',
    timeframe: 'weekly',
    progress: 42,
    milestones: [
      { title: 'Finish layout', completed: true },
      { title: 'Add project content', completed: false }
    ],
    dueDate: '2026-06-30'
  }
];

export const habits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning meditation',
    frequency: 'daily',
    streak: 21,
    history: [true, true, true, false, true, true, true],
    color: '#0ea5e9'
  },
  {
    id: 'habit-2',
    title: 'Read 20 pages',
    frequency: 'daily',
    streak: 14,
    history: [true, true, false, true, true, false, true],
    color: '#22c55e'
  }
];

export const expenses: Expense[] = [
  { id: 'expense-1', title: 'Freelance payment', amount: 1200, type: 'income', category: 'income', date: '2026-05-04', notes: 'Client milestone payout.' },
  { id: 'expense-2', title: 'Groceries', amount: 86, type: 'expense', category: 'food', date: '2026-05-08' },
  { id: 'expense-3', title: 'Streaming subscription', amount: 18, type: 'expense', category: 'entertainment', date: '2026-05-12' }
];

export const studyTasks: StudyTask[] = [
  { id: 'study-1', subject: 'Advanced React', deadline: '2026-06-14', progress: 74, examReminderAt: '2026-06-12', notes: 'Focus on server actions and state management.' },
  { id: 'study-2', subject: 'MongoDB Design', deadline: '2026-06-22', progress: 51, examReminderAt: '2026-06-20', notes: 'Practice aggregation and index strategy.' }
];

export const dashboard: DashboardPayload = {
  cards: {
    goals: goals.length,
    habits: habits.length,
    expenses: expenses.length,
    studyTasks: studyTasks.length
  },
  progress: [
    { label: 'Goals', value: 55 },
    { label: 'Habits', value: 78 },
    { label: 'Expenses', value: 64 },
    { label: 'Study', value: 69 }
  ],
  weeklyHabit: [
    { day: 'Mon', value: 3 },
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 2 },
    { day: 'Thu', value: 5 },
    { day: 'Fri', value: 4 },
    { day: 'Sat', value: 1 },
    { day: 'Sun', value: 3 }
  ],
  monthlySpending: [
    { name: 'Rent', value: 1400 },
    { name: 'Food', value: 420 },
    { name: 'Transport', value: 120 },
    { name: 'Learning', value: 160 },
    { name: 'Fun', value: 210 }
  ],
  aiInsights: [
    'A monthly goal is at risk of slipping; schedule two focused sessions this week.',
    'Spending in food is 12% above your target. Consider a tighter weekly cap.',
    'Your meditation streak is strong; extend it by pairing it with your morning planning block.'
  ],
  calendar: [
    { date: '2026-05-21', label: 'Budget review' },
    { date: '2026-05-23', label: 'Goal check-in' },
    { date: '2026-05-26', label: 'Exam reminder' }
  ],
  goals,
  habits,
  expenses,
  studyTasks
};