import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUserPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const token = header.slice(7);
    req.authUser = jwt.verify(token, env.jwtSecret) as AuthUserPayload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};