import express from 'express';
import RecipeController from '../controllers/RecipeController.js';
import protectRoute from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protectRoute, RecipeController.addRecipe);
router.get('/saved', protectRoute, RecipeController.getRecipes);
router.post('/save/:recipeId', protectRoute, RecipeController.saveRecipe);

export default router;
