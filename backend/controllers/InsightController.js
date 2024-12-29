import Insight from '../models/Insight.js';
import Alert from './AlertController.js';
import nutrientsData from '../utils/nutrients.js';

class InsightController {
  static _calculateEndDate(type) {
    const now = new Date();

    if (type === 'Macro') {
      return new Date(now.setUTCHours(23, 59, 59, 999));
    } if (type === 'Micro') {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setUTCHours(23, 59, 59, 999);
      return endOfWeek;
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
        await insight.save();
      }
      const endDate = this._calculateEndDate(type);

      const nutrients = {};
      for (const [nutrientName, nutrient] of Object.entries(nutrientsData)) {
        if (nutrient.recommended.type === type) {
          nutrients[nutrientName] = {
            totalValue: 0,
            recommendedValue: nutrient.recommended.amount || 0,
            status: 'onTrack',
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

  static _determineStatus(totalValue, recommendedValue) {
    if (totalValue < recommendedValue * 0.9) return 'deficient';
    if (totalValue > recommendedValue * 1.1) return 'excess';
    return 'onTrack';
  }

  static _determineSeverity(status, nutrient) {
    if (nutrient.recommended === 0) {
      return 'mild';
    }

    const percentage = nutrient.totalValue / nutrient.recommendedValue;

    if (status === 'deficient') {
      if (percentage < 0.5) return 'severe';
      if (percentage < 0.8) return 'moderate';
      return 'mild';
    }

    if (status === 'excess') {
      if (percentage > 1.5) return 'severe';
      if (percentage > 1.2) return 'moderate';
      return 'mild';
    }
    return 'mild';
  }

  static async updateInsight(insight, nutrientData) {
    try {
      if (!Array.isArray(nutrientData)) {
        throw new Error('Nutrient Data must be an array.');
      }

      const alertsToGenerate = [];

      nutrientData.forEach((nutrient) => {
        if (!nutrient.name) return;

        const key = nutrient.name;
        const existingNutrient = insight.nutrients.get(key);

        if (existingNutrient) {
          existingNutrient.totalValue += nutrient.value;

          const newStatus = this._determineStatus(
            existingNutrient.totalValue,
            existingNutrient.recommendedValue,
          );

          if (
            (existingNutrient.status !== newStatus)
            && (newStatus === 'excess' || newStatus === 'deficient')
          ) {
            alertsToGenerate.push({
              userId: insight.userId,
              nutrientName: nutrient.name,
              alertType: newStatus,
              status: 'pending',
              severity: this._determineSeverity(newStatus, existingNutrient),
            });
          }
          existingNutrient.status = newStatus;
        }
      });
      await insight.save();

      if (alertsToGenerate.length > 0) {
        await Alert.generateAlerts(alertsToGenerate);
      }

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
