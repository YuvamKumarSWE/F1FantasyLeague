import { Router } from 'express';
import { getRaceResults, getDriverFantasyPoints, getAllDriversFantasyPoints } from '../controllers/resultController';

const resultRouter = Router();

// Get results for a specific race from external API
// GET /api/v1/results/:year/:round
resultRouter.get('/:year/:round', getRaceResults);

// Get driver's fantasy points for a specific race
// GET /api/v1/results/:year/:round/driver/:driverId/fantasy-points?isCaptain=true
resultRouter.get('/:year/:round/driver/:driverId/fantasy-points', getDriverFantasyPoints);

// Get all drivers' fantasy points for a specific race
// GET /api/v1/results/:year/:round/fantasy-points
resultRouter.get('/:year/:round/fantasy-points', getAllDriversFantasyPoints);

module.exports = resultRouter;
