import { Router } from 'express';
import { createStudyTask, deleteStudyTask, getStudyTask, listStudyTasks, updateStudyTask } from '../controllers/studyTaskController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listStudyTasks);
router.post('/', requireAuth, createStudyTask);
router.get('/:id', requireAuth, getStudyTask);
router.put('/:id', requireAuth, updateStudyTask);
router.patch('/:id', requireAuth, updateStudyTask);
router.delete('/:id', requireAuth, deleteStudyTask);

export default router;