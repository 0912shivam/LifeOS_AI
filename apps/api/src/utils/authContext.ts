import { Request } from 'express';

export const getAuthenticatedUserId = (req: Request) => req.authUser?.userId || null;
