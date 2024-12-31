import Alert from '../models/Alert.js';

class AlertController {
  static async generateAlerts(alerts) {
    try {
      await Alert.insertMany(alerts);
    } catch (err) {
      console.error(`Error generating alerts: ${err.message}`);
      throw err;
    }
  }

  static async getAlerts(req, res) {
    const { status = 'active', limit = 10 } = req.query;

    const query = { userId: req.user._id, status };

    try {
      const alerts = await Alert.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10));
      return res.status(200).json(alerts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default AlertController;
