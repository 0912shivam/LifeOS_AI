export type Timeframe = 'yearly' | 'monthly' | 'weekly';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  preferences?: {
    theme?: string;
    currency?: string;
  };
}

export interface Milestone {
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: Timeframe;
  progress: number;
  milestones: Milestone[];
  dueDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: string;
  streak: number;
  history: boolean[];
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  deadline: string;
  progress: number;
  examReminderAt?: string;
  notes?: string;
}

export interface DashboardSummary {
  cards: {
    goals: number;
    habits: number;
    expenses: number;
    studyTasks: number;
  };
  progress: Array<{ label: string; value: number }>;
  weeklyHabit: Array<{ day: string; value: number }>;
  monthlySpending: Array<{ name: string; value: number }>;
  aiInsights: string[];
  calendar: Array<{ date: string; label: string }>;
}

export interface DashboardPayload extends DashboardSummary {
  goals?: Goal[];
  habits?: Habit[];
  expenses?: Expense[];
  studyTasks?: StudyTask[];
}