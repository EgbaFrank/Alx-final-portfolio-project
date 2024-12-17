import MealLog from '../models/MealLog.js';

class MealLogController {
  static async createMealLog(req, res) {
    const {
      mealName, mealType, portionSize, nutrients,
    } = req.body;

    try {
      const mealLog = new MealLog({
        userId: req.user._id,
        mealName,
        mealType,
        portionSize,
        nutrients,
      });

      await mealLog.save();
      return res.status(201).json({ message: 'Meal log created successfully', mealLog });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getMealLogs(req, res) {
    try {
      const mealLogs = await MealLog.find({ userId: req.user._id });
      return res.status(200).json({ mealLogs });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getMealLog(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({ error: 'Please specify a mealLog ID' });
    }

    try {
      const mealLog = await MealLog.findById(id);
      if (!mealLog) {
        return res.status(404).json({ message: 'Meal log not found' });
      }
      return res.status(200).json({ mealLog });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default MealLogController;
