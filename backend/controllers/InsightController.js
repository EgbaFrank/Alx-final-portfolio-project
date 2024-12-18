import Insight from '../models/Insight.js';

class InsightController {
  static async createInsight(userId, period, endDate, nutrients) {
    try {
      const insight = new Insight({
        userId,
        period,
        endDate,
        nutrients,
      });

      await insight.save();
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create insight');
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
