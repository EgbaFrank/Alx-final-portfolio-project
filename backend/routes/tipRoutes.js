import express from 'express';
import TipController from '../controllers/TipController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protectRoute, TipController.getTips);

export default router;
