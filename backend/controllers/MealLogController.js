import MealLog from '../models/MealLog.js';
import Recipe from '../models/Recipe.js';

class MealLogController {
  static async createMealLog(req, res) {
    try {
      const { recipeId, mealType } = req.body;

      if (!recipeId || !mealType) {
        return res.status(400).json({ error: 'Recipe ID and meal type are required' });
      }
      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      await MealLog.create({
        userId: req.user._id,
        recipe: recipeId,
        mealType,
        nutrientAggregate: recipe.nutrientAggregate,
      });

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

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (!startDate && !endDate) {
        const today = new Date();

        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() + 6));

        query.updatedAt = { $gte: startOfWeek, $lte: endOfWeek };
      } else {
        query.updatedAt = {};
        if (startDate) query.updatedAt.$gte = new Date(startDate);
        if (endDate) query.updatedAt.$lte = new Date(endDate);
      }

      const mealLogs = await MealLog.find(query)
        .populate('recipe', 'name')
        .sort({ updatedAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

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
