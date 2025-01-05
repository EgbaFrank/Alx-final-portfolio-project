import Tip from '../models/Tip.js';
import nutrients from '../utils/nutrients.js';
import tipTemplates from '../utils/tipTemplates.js';

class TipController {
  static _generateTip(nutrientName, status, severity) {
    const nutrient = nutrients[nutrientName];
    if (!nutrient) {
      throw new Error(`Nutrient ${nutrientName} not found`);
    }

    const foodSuggestions = nutrient.foodSources || [];
    if (foodSuggestions.length < 2) {
      throw new Error(`Not enough food sources for nutrient ${nutrientName}`);
    }

    const templates = tipTemplates[status][severity];
    if (!templates) {
      throw new Error(`No template found for ${severity} ${status}`);
    }

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomFood1 = foodSuggestions[Math.floor(Math.random() * foodSuggestions.length)];

    let randomFood2 = randomFood1;

    while (randomFood2 === randomFood1) {
      randomFood2 = foodSuggestions[Math.floor(Math.random() * foodSuggestions.length)];
    }

    return randomTemplate
      .replaceAll('{nutrientName}', nutrientName)
      .replace('{foodSuggestion1}', randomFood1)
      .replace('{foodSuggestion2}', randomFood2);
  }

  static async processAlerts(alerts) {
    try {
      await Tip.updateMany({ active: true }, { $set: { active: false } });

      const tipPromises = alerts.map(async (alert) => {
        try {
          const { nutrientName, alertType, severity } = alert;
          const tipMessage = this._generateTip(nutrientName, alertType, severity);

          return Tip.create({
            userId: alert.userId,
            alertId: alert._id,
            message: tipMessage,
            active: true,
            nutrientName,
          });
        } catch (err) {
          console.error(`Error generating tip for ${alert.nutrientName}: ${err.message}`);
          return null;
        }
      });
      const results = await Promise.all(tipPromises);
      console.log(`${results.filter(Boolean).length} tips generated successfully`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getTips(req, res) {
    const {
      nutrient, active = 'true', page = 1, limit = 10,
    } = req.query;

    const isActive = active.toLowerCase() === 'true';

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid page or limit value' });
    }

    const query = { userId: req.user._id, active: isActive };

    if (nutrient) {
      query.nutrientName = nutrient;
    }

    try {
      const tips = await Tip.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();

      const total = await Tip.countDocuments(query);

      return res.status(200).json({
        tips,
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

export default TipController;
