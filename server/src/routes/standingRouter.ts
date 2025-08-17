import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();
const standingController = require('../controllers/standingController');

// GET /api/v1/standings/:year
router.route('/').get(authMiddleware, standingController.getStandings);

export default router;
