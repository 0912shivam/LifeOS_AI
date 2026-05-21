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

  const allowedOrigins = [
    'http://localhost:3000',
    'https://life-os-ai-web-9y2l.vercel.app'
  ];

  console.log('CORS enabled for:', allowedOrigins);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );
  app.options('*', cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', name: 'LifeOS AI API' });
  });

  app.use('/api/auth', authRoutes);
  console.log('[LifeOS API] Auth routes mounted at /api/auth');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('[LifeOS API] Dashboard routes mounted at /api/dashboard');
  app.use('/api/goals', goalRoutes);
  console.log('[LifeOS API] Goal routes mounted at /api/goals');
  app.use('/api/habits', habitRoutes);
  console.log('[LifeOS API] Habit routes mounted at /api/habits');
  app.use('/api/expenses', expenseRoutes);
  console.log('[LifeOS API] Expense routes mounted at /api/expenses');
  app.use('/api/study', studyRoutes);
  console.log('[LifeOS API] Study routes mounted at /api/study');

  app.use(notFound);
  app.use(errorHandler);

  return app;
};