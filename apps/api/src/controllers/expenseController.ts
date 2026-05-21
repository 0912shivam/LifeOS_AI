import { Request, Response } from 'express';
import { z } from 'zod';
import { Expense } from '../models/Expense';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuthenticatedUserId } from '../utils/authContext';
import { isValidObjectId } from '../utils/objectId';

const expenseSchema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(2),
  date: z.coerce.date().optional().default(() => new Date()),
  notes: z.string().optional().default('')
});

const expenseUpdateSchema = expenseSchema.partial();

const requireUserId = (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' });
    return null;
  }

  return userId;
};

const formatExpense = (expense: any) => ({
  id: String(expense._id || expense.id),
  title: expense.title,
  amount: expense.amount,
  type: expense.type,
  category: expense.category,
  date: expense.date ? new Date(expense.date).toISOString() : undefined,
  notes: expense.notes || '',
  createdAt: expense.createdAt?.toISOString(),
  updatedAt: expense.updatedAt?.toISOString()
});

export const listExpenses = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const expenses = await Expense.find({ userId }).sort({ date: -1, createdAt: -1 }).lean();
  res.json({ expenses: expenses.map((expense) => formatExpense(expense)) });
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = expenseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid expense payload', issues: parsed.error.flatten() });
  }

  const expense = await Expense.create({ userId, ...parsed.data });
  res.status(201).json({ expense: formatExpense(expense) });
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid expense id' });
  }

  const expense = await Expense.findOne({ _id: id, userId }).lean();

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.json({ expense: formatExpense(expense) });
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid expense id' });
  }

  const parsed = expenseUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid expense payload', issues: parsed.error.flatten() });
  }

  const expense = await Expense.findOneAndUpdate({ _id: id, userId }, parsed.data, { new: true }).lean();

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.json({ expense: formatExpense(expense) });
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid expense id' });
  }

  const deleted = await Expense.findOneAndDelete({ _id: id, userId }).lean();

  if (!deleted) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.status(204).send();
});
