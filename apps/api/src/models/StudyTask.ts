import { Schema, model, models } from 'mongoose';

const studyTaskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    deadline: { type: Date, required: true },
    progress: { type: Number, default: 0 },
    examReminderAt: { type: Date },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const StudyTask = models.StudyTask || model('StudyTask', studyTaskSchema);