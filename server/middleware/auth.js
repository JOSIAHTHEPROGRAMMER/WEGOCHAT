import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// I hate it here
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -__v'); 

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Token is not valid.' });
  }
};
