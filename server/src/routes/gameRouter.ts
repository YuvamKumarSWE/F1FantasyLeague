import { Router, Request, Response } from 'express';
import { FantasyTeam, Driver, Race, User } from '../models';
import { authMiddleware } from '../middleware/authMiddleware';
import { calculateFantasyPoints } from '../controllers/resultController';
import axios from 'axios';

const gameRouter = Router();

gameRouter.get('/:raceId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const role = req.user?.role;

        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not the one! Ask Neo'
            });
        }

        const { raceId } = req.params;

        // Fetch the race to validate it exists
        const race = await Race.findById(raceId).exec();
        if (!race) {
            return res.status(404).json({
                success: false,
                message: 'Race not found'
            });
        }

        // Get race results from external API using year and round
        const apiUrl = `https://f1api.dev/api/${race.year}/${race.round}/race`;
        let raceResults;
        
        try {
            const response = await axios.get(apiUrl);
            raceResults = response.data?.races?.results;
            
            if (!raceResults || !Array.isArray(raceResults)) {
                return res.status(400).json({
                    success: false,
                    message: 'No results found for this race from external API'
                });
            }
        } catch (apiError) {
            return res.status(400).json({
                success: false,
                message: 'Could not fetch race results from external API',
                error: apiError instanceof Error ? apiError.message : String(apiError)
            });
        }

        // Build fast lookup maps for fantasy points calculation
        const driverFantasyPoints = new Map<string, number>();
        const driverFantasyPointsByNumber = new Map<number, number>();

        for (const result of raceResults) {
            const driverId = result.driver?.driverId;
            const driverNumber = result.driver?.number;
            
            if (driverId && driverNumber) {
                const fantasyPoints = calculateFantasyPoints(result, false); // Base points (not captain)
                driverFantasyPoints.set(driverId, fantasyPoints);
                driverFantasyPointsByNumber.set(driverNumber, fantasyPoints);
            }
        }

        // Fetch all fantasy teams for this race
        const teams = await FantasyTeam.find({ race: race._id }).exec();

        const updated: any[] = [];

        for (const team of teams) {
            let totalPoints = 0;

            // Fetch drivers separately to avoid validation issues
            const teamDrivers = await Driver.find({ _id: { $in: team.drivers } }).exec();

            // Calculate points for each driver
            for (const driver of teamDrivers) {
                const isCaptain = team.captain && driver._id.equals(team.captain);
                
                // Get fantasy points using both driverId and number as fallback
                let basePoints = driverFantasyPoints.get(driver.driverId) ?? 
                               driverFantasyPointsByNumber.get(driver.number) ?? 0;
                
                // Captain gets double points
                const driverPoints = isCaptain ? basePoints * 2 : basePoints;
                totalPoints += driverPoints;
                
                console.log(`Driver ${driver.driverId} (${driver.number}): ${basePoints} base points, ${driverPoints} total (captain: ${isCaptain})`);
            }

            // Update team points if changed
            if (team.points !== totalPoints) {
                console.log(`Updating team ${team._id} points from ${team.points} to ${totalPoints}`);
                
                const pointsEarned = totalPoints - team.points;
                team.points = totalPoints;
                
                try {
                    await team.save();
                    
                    // Update user's fantasy points
                    await User.findByIdAndUpdate(
                        team.user,
                        { $inc: { fantasyPoints: pointsEarned } },
                        { new: true }
                    );
                    
                    updated.push({ 
                        teamId: team._id, 
                        userId: team.user,
                        points: totalPoints,
                        pointsEarned: pointsEarned 
                    });
                } catch (saveError: any) {
                    console.error('Save error for team', team._id, ':', saveError.message);
                    throw saveError;
                }
            }
        }

        return res.status(200).json({
            success: true,
            raceId: race.raceId,
            year: race.year,
            round: race.round,
            updatedTeams: updated,
            totalResultsProcessed: raceResults.length,
            apiSource: apiUrl
        });
    } catch (err: any) {
        console.error('[gameRouter] error calculating points', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err?.message
        });
    }
});

const getLastRaceResult = async() => {
    const response = await axios.get('https://f1api.dev/api/current/last/race');
    return response.data;
}

export default gameRouter;
