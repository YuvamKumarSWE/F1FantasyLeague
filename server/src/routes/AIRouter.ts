import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
import { handleAIChatbot } from '../controllers/AIController';

const router = express.Router();

// AI chatbot endpoint - requires authentication
router.route('/chat').post(authMiddleware, handleAIChatbot);

export default router;
