import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatarUrl: { type: String, default: '' },
    preferences: {
      theme: { type: String, default: 'dark' },
      currency: { type: String, default: 'USD' }
    }
  },
  { timestamps: true }
);

export const User = models.User || model('User', userSchema);