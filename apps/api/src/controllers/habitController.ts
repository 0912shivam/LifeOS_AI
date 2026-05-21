import { Request, Response } from 'express';
import { z } from 'zod';
import { Habit } from '../models/Habit';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuthenticatedUserId } from '../utils/authContext';
import { isValidObjectId } from '../utils/objectId';

const habitSchema = z.object({
  title: z.string().min(2),
  frequency: z.string().min(2).optional().default('daily'),
  streak: z.number().int().min(0).optional().default(0),
  history: z.array(z.boolean()).optional().default([]),
  color: z.string().min(3).optional().default('#22c55e')
});

const habitUpdateSchema = habitSchema.partial();

const requireUserId = (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' });
    return null;
  }

  return userId;
};

const formatHabit = (habit: any) => ({
  id: String(habit._id || habit.id),
  title: habit.title,
  frequency: habit.frequency || 'daily',
  streak: habit.streak ?? 0,
  history: habit.history || [],
  color: habit.color || '#22c55e',
  createdAt: habit.createdAt?.toISOString(),
  updatedAt: habit.updatedAt?.toISOString()
});

export const listHabits = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const habits = await Habit.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json({ habits: habits.map((habit) => formatHabit(habit)) });
});

export const createHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = habitSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid habit payload', issues: parsed.error.flatten() });
  }

  const habit = await Habit.create({ userId, ...parsed.data });
  res.status(201).json({ habit: formatHabit(habit) });
});

export const getHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid habit id' });
  }

  const habit = await Habit.findOne({ _id: id, userId }).lean();

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  res.json({ habit: formatHabit(habit) });
});

export const updateHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid habit id' });
  }

  const parsed = habitUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid habit payload', issues: parsed.error.flatten() });
  }

  const habit = await Habit.findOneAndUpdate({ _id: id, userId }, parsed.data, { new: true }).lean();

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  res.json({ habit: formatHabit(habit) });
});

export const deleteHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid habit id' });
  }

  const deleted = await Habit.findOneAndDelete({ _id: id, userId }).lean();

  if (!deleted) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  res.status(204).send();
});
