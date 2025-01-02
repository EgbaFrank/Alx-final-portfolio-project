import Alert from '../models/Alert.js';
import tipController from './TipController.js';
import determineStatus from '../utils/status-utils.js';

class AlertController {
  static async _saveAlerts(alerts) {
    try {
      await Alert.updateMany({ active: true }, { $set: { active: false } });

      const savePromises = alerts.map((alertData) => {
        const alert = new Alert(alertData);
        return alert.save();
      });

      const insertedAlerts = await Promise.all(savePromises);
      console.log(`${insertedAlerts.length} new alerts created!!!`);

      return await tipController.processAlerts(insertedAlerts);
    } catch (err) {
      console.error(`Error generating alerts: ${err.message}`);
      throw err;
    }
  }

  static _determineSeverity(status, nutrient) {
    if (nutrient.recommended === 0) {
      return 'mild';
    }
    const ratio = nutrient.totalValue / nutrient.recommendedValue;

    if (status === 'deficient') {
      if (ratio < 0.3) return 'severe';
      if (ratio < 0.6) return 'moderate';
      return 'mild';
    }

    if (status === 'excess') {
      if (ratio > 1.7) return 'severe';
      if (ratio > 1.4) return 'moderate';
      return 'mild';
    }
    return 'mild';
  }

  static async generateAlerts(insight) {
    const alertsToGenerate = [];

    for (const [nutrientName, nutrient] of insight.nutrients.entries()) {
      const ratio = nutrient.totalValue / nutrient.recommendedValue;
      const status = determineStatus(
        nutrient.totalValue,
        nutrient.recommendedValue,
      );

      if (status === 'excess' || status === 'deficient') {
        alertsToGenerate.push({
          userId: insight.userId,
          insightId: insight._id,
          nutrientName,
          alertType: status,
          percentage: ratio * 100,
          active: true,
          severity: this._determineSeverity(status, nutrient),
          critical: ratio < 0.2 || ratio > 2.0,
        });
      }
    }
    if (alertsToGenerate.length > 0) {
      await this._saveAlerts(alertsToGenerate);
    }
  }

  static async getAlerts(req, res) {
    const { active = 'true', page = 1, limit = 10 } = req.query;

    const isActive = active.toLowerCase() === 'true';

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid page or limit value' });
    }

    const query = { userId: req.user._id, active: isActive };

    try {
      const alerts = await Alert.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(parseInt(limit, 10));

      const total = await Alert.countDocuments(query);

      return res.status(200).json({
        alerts,
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

export default AlertController;
