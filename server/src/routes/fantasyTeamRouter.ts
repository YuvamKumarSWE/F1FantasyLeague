import express from 'express';
const router = express.Router();
const fantasyTeamController = require('../controllers/fantasyTeamController');
import { authMiddleware } from '../middleware/authMiddleware';

router.route('/').post(authMiddleware, fantasyTeamController.createTeam);
router.route('/:raceId').get(authMiddleware, fantasyTeamController.getTeam);

export default router;