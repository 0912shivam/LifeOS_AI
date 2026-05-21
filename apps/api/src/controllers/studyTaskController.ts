import { Request, Response } from 'express';
import { z } from 'zod';
import { StudyTask } from '../models/StudyTask';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuthenticatedUserId } from '../utils/authContext';
import { isValidObjectId } from '../utils/objectId';

const studyTaskSchema = z.object({
  subject: z.string().min(2),
  deadline: z.coerce.date(),
  progress: z.number().min(0).max(100).optional().default(0),
  examReminderAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().default('')
});

const studyTaskUpdateSchema = studyTaskSchema.partial();

const requireUserId = (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' });
    return null;
  }

  return userId;
};

const formatStudyTask = (task: any) => ({
  id: String(task._id || task.id),
  subject: task.subject,
  deadline: new Date(task.deadline).toISOString(),
  progress: task.progress ?? 0,
  examReminderAt: task.examReminderAt ? new Date(task.examReminderAt).toISOString() : undefined,
  notes: task.notes || '',
  createdAt: task.createdAt?.toISOString(),
  updatedAt: task.updatedAt?.toISOString()
});

export const listStudyTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const studyTasks = await StudyTask.find({ userId }).sort({ deadline: 1, createdAt: -1 }).lean();
  res.json({ studyTasks: studyTasks.map((task) => formatStudyTask(task)) });
});

export const createStudyTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const parsed = studyTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid study task payload', issues: parsed.error.flatten() });
  }

  const studyTask = await StudyTask.create({ userId, ...parsed.data });
  res.status(201).json({ studyTask: formatStudyTask(studyTask) });
});

export const getStudyTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid study task id' });
  }

  const studyTask = await StudyTask.findOne({ _id: id, userId }).lean();

  if (!studyTask) {
    return res.status(404).json({ message: 'Study task not found' });
  }

  res.json({ studyTask: formatStudyTask(studyTask) });
});

export const updateStudyTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid study task id' });
  }

  const parsed = studyTaskUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid study task payload', issues: parsed.error.flatten() });
  }

  const studyTask = await StudyTask.findOneAndUpdate({ _id: id, userId }, parsed.data, { new: true }).lean();

  if (!studyTask) {
    return res.status(404).json({ message: 'Study task not found' });
  }

  res.json({ studyTask: formatStudyTask(studyTask) });
});

export const deleteStudyTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireUserId(req, res);
  if (!userId) return;

  const id = String(req.params.id);

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid study task id' });
  }

  const deleted = await StudyTask.findOneAndDelete({ _id: id, userId }).lean();

  if (!deleted) {
    return res.status(404).json({ message: 'Study task not found' });
  }

  res.status(204).send();
});
