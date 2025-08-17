import express from 'express';
import { getRaceResults, getAllDriversFantasyPoints } from '../controllers/resultController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get results for a specific race from external API using raceId
// GET /api/v1/results/:raceId
router.get('/:raceId', authMiddleware,  getRaceResults);

// Get all drivers' fantasy points for a specific race using raceId
// GET /api/v1/results/:raceId/fantasy-points
router.get('/:raceId/fantasy-points', authMiddleware, getAllDriversFantasyPoints);

export default router;
