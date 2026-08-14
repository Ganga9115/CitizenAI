import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/overview', AnalyticsController.getOverview);
router.get('/scoreboard', AnalyticsController.getScoreboard);
router.get('/map-markers', AnalyticsController.getMapMarkers);

export default router;
