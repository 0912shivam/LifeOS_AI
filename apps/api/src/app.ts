import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import goalRoutes from './routes/goalRoutes';
import habitRoutes from './routes/habitRoutes';
import expenseRoutes from './routes/expenseRoutes';
import studyRoutes from './routes/studyRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', name: 'LifeOS AI API' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/study', studyRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};