import Insight from '../models/Insight.js';

class InsightController {
  static async createInsight(userId, deficiency, recommendation) {
    try {
      const insight = new Insight({
        userId,
        deficiency,
        recommendation,
      });

      await insight.save();
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create insight');
    }
  }

  static async getInsights(req, res) {
    try {
      const insights = await Insight.find({ userId: req.user._id });
      return res.status(200).json({ insights });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default InsightController;
