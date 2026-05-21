import { createApp } from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';

const start = async () => {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log('[LifeOS API] Environment:', process.env.NODE_ENV);
    console.log(`[LifeOS API] Running on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error('[LifeOS API] Failed to start', error);
  process.exit(1);
});