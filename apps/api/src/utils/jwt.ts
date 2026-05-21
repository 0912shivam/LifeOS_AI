import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUserPayload } from '../middleware/auth';

export const signAuthToken = (payload: AuthUserPayload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
};