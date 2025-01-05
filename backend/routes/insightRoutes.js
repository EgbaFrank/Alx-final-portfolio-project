import express from 'express';
import InsightController from '../controllers/InsightController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, InsightController.getInsights);
router.get('/latest/:type', protectRoute, InsightController.getLatestInsight);

export default router;
