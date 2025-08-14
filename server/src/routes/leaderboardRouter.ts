import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const leaderboardRouter = Router();

leaderboardRouter.get('/', getLeaderboard);
leaderboardRouter.get('/my-rank', authMiddleware, getUserRank);

export default leaderboardRouter;
