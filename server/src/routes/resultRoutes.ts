import express from 'express';
import { getRaceResults, getAllDriversFantasyPoints } from '../controllers/resultController';

const router = express.Router();

// Get results for a specific race from external API
// GET /api/v1/results/:year/:round
router.get('/:year/:round', getRaceResults);

// Get all drivers' fantasy points for a specific race
// GET /api/v1/results/:year/:round/fantasy-points
router.get('/:year/:round/fantasy-points', getAllDriversFantasyPoints);

export default router;
