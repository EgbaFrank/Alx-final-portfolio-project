import express from 'express';
import UserController from '../controllers/UserController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/me', protectRoute, UserController.getUser);

export default router;
