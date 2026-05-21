import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/asyncHandler';
import { hashPassword, comparePassword } from '../utils/password';
import { signAuthToken } from '../utils/jwt';
import { env } from '../config/env';

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

const formatUser = (user: {
  _id?: unknown;
  id?: unknown;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
}) => ({
  id: String(user._id || user.id),
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  avatarUrl: user.avatarUrl || '',
  preferences: user.preferences || { theme: 'dark', currency: 'USD' }
});

const ensurePersistenceAvailable = () => {
  if (!env.mongodbUri) {
    throw new Error('Database connection is not configured');
  }
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsed = authSchema.safeParse(req.body);

  if (!parsed.success || !parsed.data.name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  ensurePersistenceAvailable();

  const existing = await User.findOne({ email: parsed.data.email });

  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    password: await hashPassword(parsed.data.password)
  });

  const token = signAuthToken({ userId: String(user._id), email: user.email, name: user.name });
  return res.status(201).json({ token, user: formatUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = authSchema.omit({ name: true }).safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  ensurePersistenceAvailable();

  const user = await User.findOne({ email: parsed.data.email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await comparePassword(parsed.data.password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signAuthToken({ userId: String(user._id), email: user.email, name: user.name });
  return res.json({ token, user: formatUser(user) });
});

export const me = asyncHandler(async (_req: Request, res: Response) => {
  ensurePersistenceAvailable();

  const user = await User.findById((_req as Request).authUser?.userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: formatUser(user) });
});