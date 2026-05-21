import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is required for database persistence');
  }

  await mongoose.connect(env.mongodbUri);
  console.log('[LifeOS API] Connected to MongoDB');
  return mongoose.connection;
};