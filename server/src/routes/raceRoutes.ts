import express from 'express';
const router = express.Router();
const raceController = require('../controllers/raceController');

// Get all races with optional year filter
router.route('/').get(raceController.getRaces);

// Get current (next upcoming) race
router.route('/current').get(raceController.getCurrentRace);

// Get completed races
router.route('/completed').get(raceController.getCompletedRaces);

// Get upcoming races
router.route('/upcoming').get(raceController.getUpcomingRaces);

// Get race status by ID
router.route('/:raceId/status').get(raceController.getRaceStatus);

export default router;