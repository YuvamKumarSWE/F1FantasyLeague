import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();
const AIController = require('../controllers/AICoordinatorController');

router.route('/').get(authMiddleware, AIController.handleAIRequest);

export default router;