import { FantasyTeam, Driver, Race, User } from '../models';
import { calculateFantasyPoints } from '../controllers/resultController';
import axios from 'axios';

export async function processRaceResults(raceId: string) {
    try {
        console.log(`Processing race results for: ${raceId}`);

        // Find the race document by raceId (e.g., "dutch_2025")
        const race = await Race.findOne({ raceId: raceId });
        if (!race) {
            throw new Error(`Race not found: ${raceId}`);
        }

        // Get race results from external API using year and round
        const apiUrl = `https://f1api.dev/api/${race.year}/${race.round}/race`;
        let raceResults;
        
        try {
            const response = await axios.get(apiUrl);
            raceResults = response.data?.results;
            
            if (!raceResults || !Array.isArray(raceResults)) {
                throw new Error('No results found for this race from external API');
            }
        } catch (apiError) {
            throw new Error(`Could not fetch race results from external API: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
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

        // Fetch all fantasy teams for this race (using MongoDB _id)
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

        return {
            success: true,
            raceId: race.raceId,
            year: race.year,
            round: race.round,
            updatedTeams: updated,
            totalResultsProcessed: raceResults.length,
            apiSource: apiUrl
        };
    } catch (err: any) {
        console.error('[gameService] error calculating points', err);
        throw err;
    }
}