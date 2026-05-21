import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeos-ai',
  jwtSecret: process.env.JWT_SECRET || 'lifeos-demo-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};