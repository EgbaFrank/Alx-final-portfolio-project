import Insight from '../models/Insight.js';
import alertController from './AlertController.js';
import nutrientsData from '../utils/nutrients.js';
import determineStatus from '../utils/status-utils.js';

class InsightController {
  static _calculateEndDate(type) {
    const now = new Date();

    if (type === 'Macro') {
      return new Date(now.setUTCHours(23, 59, 59, 999));
    } if (type === 'Micro') {
      return new Date(now.setUTCHours(23, 59, 59, 999)); // return to a week
      /** const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setUTCHours(23, 59, 59, 999);
      return endOfWeek;* */
    }
    throw new Error('Invalid type specified');
  }

  static async getActiveInsight(userId, type) {
    try {
      const insight = await Insight.findOne({ userId, type, active: true });

      if (insight && new Date() < insight.endDate) {
        return insight;
      }

      if (insight) {
        insight.active = false;

        if (insight.type === 'Micro') {
          await alertController.generateAlerts(insight);
        }

        await insight.save();
      }

      const endDate = this._calculateEndDate(type);

      const nutrients = {};
      for (const [nutrientName, nutrient] of Object.entries(nutrientsData)) {
        if (nutrient.recommended.type === type) {
          const amount = nutrient.recommended.amount ?? 0;
          const recommendedValue = type === 'Micro' ? amount : amount; // Multiply by 7 for a week's value
          nutrients[nutrientName] = {
            totalValue: 0,
            recommendedValue,
            status: 'deficient',
          };
        }
      }

      return await Insight.create({
        userId,
        type,
        active: true,
        endDate,
        nutrients,
      });
    } catch (err) {
      console.error(`Error getting active insight: ${err.message}`);
      throw err;
    }
  }

  static async updateInsight(insight, nutrientData) {
    try {
      if (!Array.isArray(nutrientData)) {
        throw new Error('Nutrient Data must be an array.');
      }

      nutrientData.forEach((nutrient) => {
        if (!nutrient.name) return;

        const key = nutrient.name;
        const existingNutrient = insight.nutrients.get(key);

        if (existingNutrient) {
          existingNutrient.totalValue += nutrient.value;

          existingNutrient.status = determineStatus(
            existingNutrient.totalValue,
            existingNutrient.recommendedValue,
          );
        }
      });
      await insight.save();

      return insight;
    } catch (err) {
      console.error(`Error updating insight: ${err.message}`);
      throw err;
    }
  }

  static async getLatestInsight(req, res) {
    const { type } = req.params;

    if (!type || !['micro', 'macro'].includes(type)) {
      return res.status(400).json({ error: 'Type parameter must be specified as either "macro" or "micro".' });
    }

    const capitalizeType = type[0].toUpperCase() + type.slice(1);
    const query = { userId: req.user._id, type: capitalizeType };

    try {
      const insight = await Insight.findOne(query).sort({ createdAt: -1 }).lean();

      if (!insight) {
        return res.status(404).json({ error: 'No insights found for specified type' });
      }

      return res.status(200).json(insight);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getInsights(req, res) {
    const {
      startDate, endDate, type, limit = 10, page = 1,
    } = req.body;

    const userId = req.user._id;

    if (!type || !['Micro', 'Macro'].includes(type)) {
      return res.status(400).json({ error: 'Type property must be specified as either "Macro" or "Micro".' });
    }

    const query = { userId, type };

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    try {
      const insights = await Insight.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();

      const total = await Insight.countDocuments(query);

      return res.status(200).json({
        insights,
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

export default InsightController;
