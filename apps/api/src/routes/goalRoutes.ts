import { Router } from 'express';
import { createGoal, deleteGoal, getGoal, listGoals, updateGoal } from '../controllers/goalController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listGoals);
router.post('/', requireAuth, createGoal);
router.get('/:id', requireAuth, getGoal);
router.put('/:id', requireAuth, updateGoal);
router.patch('/:id', requireAuth, updateGoal);
router.delete('/:id', requireAuth, deleteGoal);

export default router;