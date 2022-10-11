import express from 'express';
import { STATISTIC_ROUTE } from '../constants/routes';
import { checkAuthMiddleware } from '../middlewares/checkAuth';
import controller from '../controllers/statistic';
import { hasAdminRole } from '../middlewares/hasAdminRole';

const router = express.Router();
// @ts-ignore
router.get(STATISTIC_ROUTE.MAIN, checkAuthMiddleware, hasAdminRole, controller.getStatistic);

export default router;
