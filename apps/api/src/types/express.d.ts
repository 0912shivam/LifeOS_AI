import { AuthUserPayload } from '../middleware/auth';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUserPayload;
    }
  }
}

export {};