import Tip from '../models/Tip.js';

class TipController {
  static async getTips(req, res) {
    const { status = 'active', limit = 10 } = req.query;

    const query = { userId: req.user._id, status };

    try {
      const tips = await Tip.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10));
      return res.status(200).json(tips);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default TipController;
