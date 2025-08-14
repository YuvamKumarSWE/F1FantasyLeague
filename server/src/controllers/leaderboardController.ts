import { Request, Response } from 'express';
import { User } from '../models';

/**
 * Get leaderboard - returns all users sorted by fantasyPoints in descending order
 */
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        // Optional pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100; // Default to 100 users
        const skip = (page - 1) * limit;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 500) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 500.'
            });
        }

        // Get total count for pagination info
        const totalUsers = await User.countDocuments();

        // Fetch users sorted by fantasyPoints (highest first)
        const users = await User.find()
            .select('username fantasyPoints') // Only return username and fantasyPoints
            .sort({ fantasyPoints: -1, username: 1 }) // Sort by points desc, then username asc for ties
            .skip(skip)
            .limit(limit)
            .lean() // For better performance
            .exec();

        // Add rank to each user
        const leaderboard = users.map((user, index) => ({
            rank: skip + index + 1,
            username: user.username,
            fantasyPoints: user.fantasyPoints
        }));

        // Calculate pagination info
        const totalPages = Math.ceil(totalUsers / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            leaderboard,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                usersPerPage: limit,
                hasNextPage,
                hasPrevPage
            }
        });

    } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error?.message
        });
    }
};

/**
 * Get user's position in leaderboard
 */
export const getUserRank = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get current user's data
        const currentUser = await User.findById(userId)
            .select('username fantasyPoints')
            .exec();

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Count users with higher fantasy points to determine rank
        const higherRankedCount = await User.countDocuments({
            fantasyPoints: { $gt: currentUser.fantasyPoints }
        });

        const userRank = higherRankedCount + 1;

        // Get total users count
        const totalUsers = await User.countDocuments();

        return res.status(200).json({
            success: true,
            user: {
                rank: userRank,
                username: currentUser.username,
                fantasyPoints: currentUser.fantasyPoints,
                totalUsers
            }
        });

    } catch (error: any) {
        console.error('Error fetching user rank:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user rank',
            error: error?.message
        });
    }
};
