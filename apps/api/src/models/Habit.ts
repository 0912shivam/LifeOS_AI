import { Schema, model, models } from 'mongoose';

const habitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    frequency: { type: String, default: 'daily' },
    streak: { type: Number, default: 0 },
    history: { type: [Boolean], default: [] },
    color: { type: String, default: '#22c55e' }
  },
  { timestamps: true }
);

export const Habit = models.Habit || model('Habit', habitSchema);