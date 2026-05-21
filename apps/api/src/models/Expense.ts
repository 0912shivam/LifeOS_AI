import { Schema, model, models } from 'mongoose';

const expenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Expense = models.Expense || model('Expense', expenseSchema);