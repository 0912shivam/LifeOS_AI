import { Request, Response } from 'express';
import { z } from 'zod';
import { Goal } from '../models/Goal';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuthenticatedUserId } from '../utils/authContext';
import { isValidObjectId } from '../utils/objectId';

const milestoneSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional().default(false),
  dueDate: z.coerce.date().optional().nullable()
});

const goalSchema = z.object({
  title: z.string().min(2),
  description: z.string().max(500).optional().default(''),
  timeframe: z.enum(['yearly', 'monthly', 'weekly']),
  progress: z.number().min(0).max(100).optional().default(0),
  milestones: z.array(milestoneSchema).optional().default([]),
  dueDate: z.coerce.date().optional().nullable()
});

const goalUpdateSchema = goalSchema.partial();

const requireUserId = (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' });
    return null;
  }

  return userId;
};

const formatGoal = (goal: any) => ({
  id: String(goal._id || goal.id),
  title: goal.title,
  description: goal.description || '',
  timeframe: goal.timeframe,
  progress: goal.progress ?? 0,
  milestones: (goal.milestones || []).map((milestone: any) => ({
    title: milestone.title,
    completed: milestone.completed,
    dueDate: milestone.dueDate ? milestone.dueDate.toISOString() : undefined
  })),
  dueDate: goal.dueDate ? goal.dueDate.toISOString() : undefined,
  createdAt: goal.createdAt?.toISOString(),
  updatedAt: goal.updatedAt?.toISOString()
});

export const listGoals = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const goals = await Goal.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json({ goals: goals.map((goal) => formatGoal(goal)) });
});

export const createGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = goalSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid goal payload', issues: parsed.error.flatten() });
  }

  const goal = await Goal.create({
    userId,
    ...parsed.data
  });

  res.status(201).json({ goal: formatGoal(goal) });
});

export const getGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid goal id' });
  }

  const goal = await Goal.findOne({ _id: id, userId }).lean();

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json({ goal: formatGoal(goal) });
});

export const updateGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid goal id' });
  }

  const parsed = goalUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid goal payload', issues: parsed.error.flatten() });
  }

  const goal = await Goal.findOneAndUpdate({ _id: id, userId }, parsed.data, { new: true }).lean();

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json({ goal: formatGoal(goal) });
});

export const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid goal id' });
  }

  const deleted = await Goal.findOneAndDelete({ _id: id, userId }).lean();

  if (!deleted) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.status(204).send();
});
