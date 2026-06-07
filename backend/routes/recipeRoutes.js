import express from "express";
import RecipeController from "../controllers/RecipeController.js";
import protectRoute from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, RecipeController.getAllRecipes);
router.post("/", protectRoute, RecipeController.addRecipe);
router.get("/saved", protectRoute, RecipeController.getRecipes);
router.post("/save/:recipeId", protectRoute, RecipeController.saveRecipe);
router.get("/:recipeId", protectRoute, RecipeController.getRecipeById);
router.post("/:recipeId", protectRoute, RecipeController.publishRecipe);

export default router;
