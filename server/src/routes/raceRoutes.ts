import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();
const raceController = require('../controllers/raceController');

// Get all races with optional year filter
router.route('/').get(raceController.getRaces);

// Get current (next upcoming) race
router.route('/next').get(authMiddleware, raceController.getNextRace);

// Get completed races
router.route('/completed').get(authMiddleware, raceController.getCompletedRaces);

// Get upcoming races
router.route('/upcoming').get(authMiddleware, raceController.getUpcomingRaces);

// Get race status by ID
router.route('/:raceId').get(authMiddleware, raceController.getRaceStatus);

export default router;