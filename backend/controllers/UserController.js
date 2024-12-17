import jwt from 'jsonwebtoken';
import User from '../models/User';

class UserController {
  // Register new user
  static async register(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    if (!email) {
      return res.status(401).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Missing password' });
    }

    try {
      const existingUser = User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = new User({
        firstname, lastname, email, password,
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default UserController;
