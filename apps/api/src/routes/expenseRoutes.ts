import { Router } from 'express';
import { createExpense, deleteExpense, getExpense, listExpenses, updateExpense } from '../controllers/expenseController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listExpenses);
router.post('/', requireAuth, createExpense);
router.get('/:id', requireAuth, getExpense);
router.put('/:id', requireAuth, updateExpense);
router.patch('/:id', requireAuth, updateExpense);
router.delete('/:id', requireAuth, deleteExpense);

export default router;