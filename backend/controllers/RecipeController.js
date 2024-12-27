import Recipe from '../models/Recipe.js';
import fetchNutrientData from '../services/nutritionAPI.js';
import nutrientsConfig from '../utils/nutrients.js';
import findExistingComp from '../utils/comp-utils.js';

class RecipeController {
  static async addRecipe(req, res) {
    const { name, servings, comps } = req.body;

    if (!name || !comps || !Array.isArray(comps) || comps.length === 0 || !servings) {
      return res.status(400).json({ error: 'Recipe name, servings and ingredients are required' });
    }

    if (!Number.isInteger(servings) || servings <= 0) {
      return res.status(400).json({ error: 'Servings must be a positive integer' });
    }

    try {
      const validatedComps = await Promise.all(
        comps.map(async (comp) => {
          const { name: compName, quantity, unit = 'g' } = comp;

          if (!compName || !quantity) {
            throw new Error('Each ingredient must have a name and quantity');
          }

          const nutrientData = await fetchNutrientData(compName); // || await findExistingComp(compName);

          if (!nutrientData || nutrientData.length === 0) {
            console.warn(`No nutrient data found for ${compName}`);

            return {
              name: compName,
              quantity,
              unit,
              nutrients: [],
            };
          }
          console.log(`raw ${compName} nutrient data:`, nutrientData)

          const nutrientArray = nutrientData.map((nutrient) => {
            const { name, value: amount, unit: nutrientUnit } = nutrient;
            const recommendedUnit = nutrientsConfig[name]?.recommended?.unit ?? nutrientUnit;

            return {
              name,
              unit: recommendedUnit,
              value: (amount ?? 0) * (quantity / 100),
            };
          });

          return {
            name: compName,
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

      return res.status(200).json({
        id: savedRecipe._id,
        name: savedRecipe.name,
        servings: savedRecipe.servings,
        nutrients: savedRecipe.nutrientAggregate,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async saveRecipe(req, res) {
    try {
      const { recipeId } = req.params;

      const recipeExists = await Recipe.findById(recipeId);

      if (!recipeExists) {
        throw new Error('Invalid recipe ID. Recipe does not exist');
      }
      const { user } = req;

      if (user.recipes.includes(recipeId)) {
        throw new Error('Recipe is already saved');
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
      const populatedUser = await req.user.populate('recipes');

      const simpleRecipes = populatedUser.recipes.map((recipe) => ({
        id: recipe._id,
        name: recipe.name,
        servings: recipe.servings,
        nutrientAggregate: recipe.nutrientAggregate,
      }));

      return res.status(200).json(simpleRecipes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default RecipeController;
