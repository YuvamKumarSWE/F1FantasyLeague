import { Router } from 'express';
import { getRaceResults, getAllDriversFantasyPoints } from '../controllers/resultController';

const resultRouter = Router();

// Get results for a specific race from external API
// GET /api/v1/results/:year/:round
resultRouter.get('/:year/:round', getRaceResults);

// Get all drivers' fantasy points for a specific race
// GET /api/v1/results/:year/:round/fantasy-points
resultRouter.get('/:year/:round/fantasy-points', getAllDriversFantasyPoints);

module.exports = resultRouter;
