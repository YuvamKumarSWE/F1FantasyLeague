import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const leaderboardRouter = Router();

/**
 * @route   GET /api/v1/leaderboard
 * @desc    Get global leaderboard sorted by fantasy points
 * @access  Public (no authentication required)
 * @query   page - Page number (optional, default: 1)
 * @query   limit - Users per page (optional, default: 100, max: 500)
 */
leaderboardRouter.get('/', getLeaderboard);

/**
 * @route   GET /api/v1/leaderboard/my-rank
 * @desc    Get current user's rank in the leaderboard
 * @access  Private (authentication required)
 */
leaderboardRouter.get('/my-rank', authMiddleware, getUserRank);

export default leaderboardRouter;
