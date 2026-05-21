import { Router } from 'express';
import { getDashboardInsights, getDashboardSummary } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/summary', requireAuth, getDashboardSummary);
router.get('/insights', requireAuth, getDashboardInsights);

export default router;