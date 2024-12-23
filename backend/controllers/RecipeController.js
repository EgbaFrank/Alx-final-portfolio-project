import Recipe from '../models/Recipe.js';
import fetchNutrientData from '../services/nutritionAPI.js';
import nutrientsConfig from '../utils/nutrients.js';

class RecipeController {
  static async addRecipe(req, res) {
    const { name, comps } = req.body;

    if (!name || !comps || !Array.isArray(comps) || comps.length === 0) {
      return res.status(400).json({ error: 'Recipe name and ingredients are required' });
    }

    try {
      const validatedComps = await Promise.all(
        comps.map(async (comp) => {
          const { name: compName, quantity, unit = 'g' } = comp;

          if (!compName || !quantity) {
            throw new Error('Each ingredient must have a name and quantity');
          }

          const nutrientData = await fetchNutrientData(compName);

          if (!nutrientData || nutrientData.length === 0) {
            console.warn(`No nutrient data found for ${compName}`);

            return {
              name: compName,
              quantity,
              unit,
              nutrients: [],
	    };
          }

          const nutrientArray = nutrientData.map((nutrient) => {
            const { name, amount, unit: nutrientUnit } = nutrient;
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
      });

      const savedRecipe = await newRecipe.save();

      return res.status(200).json(savedRecipe);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async getRecipes(req, res) {
  }

  static async saveRecipe(req, res) {
  }
}

export default RecipeController;
