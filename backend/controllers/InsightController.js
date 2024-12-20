import Insight from '../models/Insight.js';
import Alert from './AlertController.js';

class InsightController {
  static _calculateEndDate(period) {
    const now = new Date();

    if (period === 'daily') {
      return new Date(now.setUTCHours(23, 60, 60, 999));
    } if (period === 'weekly') {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setUTCHours(23, 60, 60, 999);
      return endOfWeek;
    }
    throw new Error('Invalid period specified');
  }

  static async getActiveInsight(userId, period) {
    try {
      const insight = await Insight.findOne({ userId, period, status: 'active' });

      if (insight && new Date() < insight.endDate) {
        return insight;
      }

      if (insight) {
        insight.status = 'archived';
        await insight.save();
      }
      const endDate = this._calculateEndDate(period);

      return await Insight.create({
        userId,
        period,
        status: 'active',
        endDate,
        nutrients: [],
      });
    } catch (err) {
      console.error(`Error getting active insight: ${err.messagw}`);
      throw err;
    }
  }

  static _determineStatus(totalValue, recommendedValue) {
    if (totalValue < recommendedValue * 0.9) return 'deficient';
    if (totalValue > recommendedValue * 1.1) return 'excess';
    return 'onTrack';
  }

  static _determineSeverity(status, nutrient) {
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
      const alertsToGenerate = [];

      nutrientData.foreach((nutrient) => {
        if (!nutrient.name) return;

        const key = nutrient.name.toLowerCase;

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
              status: 'pending',
              severity: this._determineSeverity(newStatus, existingNutrient),
            });
          }
          existingNutrient.status = newStatus;
        } else {
          const initialStatus = this._determineStatus(
            nutrient.value,
            nutrient.recommendedValue,
          );

          insight.nutrients.set(key, {
            totalValue: nutrient.value,
            recommendedValue: nutrient.recommendedValue,
            status: initialStatus,
          });
          if (initialStatus === 'deficient' || initialStatus === 'excess') {
            alertsToGenerate.push({
              userId: insight.userId,
              nutrientName: nutrient.name,
              status: 'pending',
              severity: this._determineSeverity(initialStatus, {
                totalValue: nutrient.value,
                recommendedValue: nutrient.recommendedValue,
              }),
            });
          }
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
    const { period } = req.query;

    const query = { userId: req.user._id };

    if (period) query.period = period;

    try {
      const insight = await Insight.findOne(query).sort({ createdAt: -1 });

      if (!insight) {
        return res.status(404).json({ error: 'No insights found for specified period' });
      }

      return res.status(200).json(insight);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getInsights(req, res) {
    const { period, limit = 10, page = 1 } = req.query;
    const query = { userId: req.user._id };

    if (period) query.period = period;

    try {
      const insights = await Insight.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * parseInt(limit, 10))
        .limit(parseInt(limit, 10));
      return res.status(200).json(insights);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default InsightController;
