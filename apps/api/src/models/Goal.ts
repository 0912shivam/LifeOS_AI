import { Schema, model, models } from 'mongoose';

const milestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date }
  },
  { _id: false }
);

const goalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    timeframe: { type: String, enum: ['yearly', 'monthly', 'weekly'], required: true },
    progress: { type: Number, default: 0 },
    milestones: { type: [milestoneSchema], default: [] },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export const Goal = models.Goal || model('Goal', goalSchema);