import { Router } from 'express';
import { createHabit, deleteHabit, getHabit, listHabits, updateHabit } from '../controllers/habitController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listHabits);
router.post('/', requireAuth, createHabit);
router.get('/:id', requireAuth, getHabit);
router.put('/:id', requireAuth, updateHabit);
router.patch('/:id', requireAuth, updateHabit);
router.delete('/:id', requireAuth, deleteHabit);

export default router;