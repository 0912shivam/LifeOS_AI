import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuthenticatedUserId } from '../utils/authContext';
import { Goal } from '../models/Goal';
import { Habit } from '../models/Habit';
import { Expense } from '../models/Expense';
import { StudyTask } from '../models/StudyTask';
import { buildDashboardAnalytics } from '../services/dashboardAnalytics';

const requireUserId = (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' });
    return null;
  }

  return userId;
};

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const [goals, habits, expenses, studyTasks] = await Promise.all([
    Goal.find({ userId }).sort({ createdAt: -1 }),
    Habit.find({ userId }).sort({ createdAt: -1 }),
    Expense.find({ userId }).sort({ date: -1, createdAt: -1 }),
    StudyTask.find({ userId }).sort({ deadline: 1, createdAt: -1 })
  ]);

  const analytics = buildDashboardAnalytics({ goals, habits, expenses, studyTasks });

  res.json({
    cards: analytics.cards,
    progress: analytics.progress,
    weeklyHabit: analytics.weeklyHabit,
    monthlySpending: analytics.monthlySpending,
    aiInsights: analytics.aiInsights,
    calendar: analytics.calendar,
    goals: analytics.goals,
    habits: analytics.habits,
    expenses: analytics.expenses,
    studyTasks: analytics.studyTasks
  });
});

export const getDashboardInsights = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const [goals, habits, expenses, studyTasks] = await Promise.all([
    Goal.find({ userId }).sort({ createdAt: -1 }),
    Habit.find({ userId }).sort({ createdAt: -1 }),
    Expense.find({ userId }).sort({ date: -1, createdAt: -1 }),
    StudyTask.find({ userId }).sort({ deadline: 1, createdAt: -1 })
  ]);

  const analytics = buildDashboardAnalytics({ goals, habits, expenses, studyTasks });

  res.json({
    insights: analytics.aiInsights,
    riskSignals: analytics.riskSignals,
    recommendations: analytics.recommendations,
    finance: analytics.finance
  });
});
