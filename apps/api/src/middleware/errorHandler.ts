import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation failed', issues: err.flatten() });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Validation failed', issues: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }

  const message = err instanceof Error ? err.message : 'Unexpected server error';
  res.status(500).json({ message });
};