import MealLog from '../models/MealLog.js';
import Recipe from '../models/Recipe.js';
import Insight from './InsightController.js';

class MealLogController {
  static async _processMealLog(userId, nutrients) {
    try {
      const [macroInsight, microInsight] = await Promise.all([
        Insight.getActiveInsight(userId, 'Macro'),
        Insight.getActiveInsight(userId, 'Micro'),
      ]);

      if (!macroInsight || !microInsight) {
        throw new Error('Could not fetch or create active insight.');
      }

      await Promise.all([
        Insight.updateInsight(macroInsight, nutrients),
        Insight.updateInsight(microInsight, nutrients),
      ]);

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async createMealLog(req, res) {
    try {
      const { recipeId, mealType, serving } = req.body;

      const userId = req.user._id;

      if (!recipeId || !mealType || !serving) {
        return res.status(400).json({ error: 'Recipe ID, meal type and serving consumed are required' });
      }

      if (Number.isNaN(serving) || serving <= 0) {
        return res.status(400).json({ error: 'Serving consumed must be a positive number' });
      }

      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const scaledNutrientAggregate = recipe.nutrientPerServing.map((nutrient) => ({
        name: nutrient.name,
        unit: nutrient.unit,
        value: nutrient.value * serving,
      }));
      console.log(`Meallog nutrient for this serving:\n${JSON.stringify(scaledNutrientAggregate, null, 2)}`);

      await MealLog.create({
        userId,
        recipe: recipeId,
        mealType,
        serving,
        nutrientPerServing: scaledNutrientAggregate,
      });

      await MealLogController._processMealLog(userId, scaledNutrientAggregate);

      return res.status(201).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getMealLogs(req, res) {
    try {
      const {
        startDate, endDate, page = 1, limit = 10,
      } = req.query;

      const query = { userId: req.user._id };

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const mealLogs = await MealLog.find(query)
        .populate('recipe', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();

      const total = await MealLog.countDocuments(query);

      return res.status(200).json({
        mealLogs,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(total / limitNumber),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default MealLogController;
