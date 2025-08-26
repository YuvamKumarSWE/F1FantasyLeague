import express from 'express';
const router = express.Router();
const fantasyTeamController = require('../controllers/fantasyTeamController');
import { authMiddleware } from '../middleware/authMiddleware';

// Create team
router.route('/').post(authMiddleware, fantasyTeamController.createTeam);

// Get user teams - this MUST come before /:raceId to avoid conflict
router.route('/me').get(authMiddleware, fantasyTeamController.getUserTeams);

// Get team by race ID
router.route('/:raceId').get(authMiddleware, fantasyTeamController.getTeam);

export default router;