import jwt from 'jsonwebtoken';
import User from '../models/User';

const protectRoute = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default protectRoute;
