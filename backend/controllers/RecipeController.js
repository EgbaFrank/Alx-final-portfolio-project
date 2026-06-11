import Recipe from "../models/Recipe.js";
import fetchNutrientData from "../services/nutritionAPI.js";
import nutrientsConfig from "../utils/nutrients.js";
import roundToDecimal from "../utils/conversions.js";

class RecipeController {
  static async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.find()
        .select("id name servings")
        .where({ isPublished: true }); // Return publicly published recipes
      return res.status(200).json(recipes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getRecipeById(req, res) {
    try {
      const { recipeId } = req.params;

      const recipe = await Recipe.findById(recipeId)
        .select("-comps.nutrients -comps.name -comps.state")
        .populate("createdBy", "firstname lastname");

      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // If the recipe is not published, only allow access if it's the creator or saved by the user
      if (
        !recipe.isPublished &&
        !recipe.createdBy.equals(req.user._id) &&
        !req.user.recipes.includes(recipeId)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      return res.status(200).json(recipe);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async publishRecipe(req, res) {
    try {
      const { recipeId } = req.params;

      const recipe = await Recipe.findById(recipeId);

      if (!recipe || recipe.isPublished) {
        throw new Error(
          "Invalid recipe ID. Recipe does not exist or is already published",
        );
      }

      if (!recipe.createdBy.equals(req.user._id)) {
        throw new Error("Unauthorized. You can only publish your own recipes");
      }

      recipe.isPublished = true;
      await recipe.save();

      return res.status(200).json({});
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async addRecipe(req, res) {
    const { name, servings, comps } = req.body;

    if (
      !name ||
      !comps ||
      !Array.isArray(comps) ||
      comps.length === 0 ||
      !servings
    ) {
      return res
        .status(400)
        .json({ error: "Recipe name, servings and ingredients are required" });
    }

    if (!Number.isInteger(servings) || servings <= 0) {
      return res
        .status(400)
        .json({ error: "Servings must be a positive integer" });
    }

    try {
      const validatedComps = await Promise.all(
        comps.map(async (comp) => {
          const {
            name: compName,
            state: compState,
            quantity,
            unit = "G",
          } = comp;

          if (!compName || !quantity) {
            throw new Error("Each ingredient must have a name and quantity");
          }

          if (!compState) {
            compState = null;
          } else {
            compState = compState.trim();
          }

          const [sourceName, nutrientData] = await fetchNutrientData(
            compName.trim(),
            compState,
          );

          if (!nutrientData || nutrientData.length === 0) {
            console.warn(
              `No nutrient data found for ${compName}, ${compState}`,
            );

            return {
              name: compName,
              sourceName,
              state: compState,
              quantity,
              unit,
              nutrients: [],
            };
          }

          const nutrientArray = nutrientData.map((nutrient) => {
            const { name, value: amount, unit: nutrientUnit } = nutrient;
            const recommendedUnit =
              nutrientsConfig[name]?.recommended?.unit ?? nutrientUnit;

            return {
              name,
              unit: recommendedUnit,
              value: roundToDecimal((amount ?? 0) * (quantity / 100)), // Assuming nutrient data is per 100g, adjust based on quantity
            };
          });

          console.log(
            `raw ${compName}, ${compState} nutrient data:`,
            JSON.stringify(nutrientArray, null, 2),
          );

          return {
            name: compName,
            sourceName,
            state: compState,
            quantity,
            unit,
            nutrients: nutrientArray,
          };
        }),
      );

      const newRecipe = new Recipe({
        name,
        comps: validatedComps,
        createdBy: req.user._id,
        servings,
      });

      const savedRecipe = await newRecipe.save();

      return res.status(201).json({
        id: savedRecipe._id,
        name: savedRecipe.name,
        servings: savedRecipe.servings,
        nutrientPerServing: savedRecipe.nutrientPerServing,
      });
    } catch (err) {
      console.error(`Error adding recipe: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }
  }

  static async saveRecipe(req, res) {
    try {
      const { recipeId } = req.params;

      const recipeExists = await Recipe.findById(recipeId);

      if (!recipeExists) {
        throw new Error("Invalid recipe ID. Recipe does not exist");
      }
      const { user } = req;

      if (user.recipes.includes(recipeId)) {
        throw new Error("Recipe is already saved");
      }

      user.recipes.push(recipeId);
      await user.save();

      return res.status(201).json({});
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async getRecipes(req, res) {
    try {
      const populatedUser = await req.user.populate("recipes");

      const simpleRecipes = populatedUser.recipes.map((recipe) => ({
        id: recipe._id,
        name: recipe.name,
        servings: recipe.servings,
        nutrientPerServing: recipe.nutrientPerServing,
      }));

      return res.status(200).json(simpleRecipes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default RecipeController;
