import express from 'express';
import AlertController from '../controllers/AlertController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, AlertController.getAlerts);

export default router;
