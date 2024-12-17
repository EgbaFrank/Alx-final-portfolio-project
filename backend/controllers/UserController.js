import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class UserController {
  static async registerUser(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(401).json({ error: 'Missing or invalid email' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Missing password' });
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = new User({
        firstname, lastname, email, password,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'User registration successful',
        user: { firstname: user.firstname, email: user.email },
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: 'Please provide email and password' });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(500).json({ error: 'User not found' });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      return res.status(200).json({
        message: 'Login successful',
        user: { firstname: user.firstname, email: user.email },
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const { user } = req; // populated by authMiddleware

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default UserController;
