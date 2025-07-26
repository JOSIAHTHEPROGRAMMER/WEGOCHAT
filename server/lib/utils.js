import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Function to generate JWT token for user authentication
export const generateAuthToken = (user) => {
  const payload = { id: user._id, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}