import express from 'express';
import MealLogController from '../controllers/MealLogController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protectRoute, MealLogController.createMealLog);
router.get('/', protectRoute, MealLogController.getMealLogs);

export default router;
