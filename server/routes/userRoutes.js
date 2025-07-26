import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { isAuthenticated, login, signup, updateUser, setStatus } from '../controllers/userController.js';

// Create a new router instance
const userRouter = express.Router();
    
// Route to handle user signup
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/updateUser', protectRoute, updateUser);
userRouter.get('/auth-check', protectRoute, isAuthenticated);
userRouter.put('/set-status', protectRoute, setStatus )

export default userRouter;