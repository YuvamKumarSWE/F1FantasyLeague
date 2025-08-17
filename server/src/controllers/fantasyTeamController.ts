import {Request,Response} from 'express';
import axios from 'axios';
import { FantasyTeam, Driver, Race } from '../models';
import mongoose from 'mongoose';

// Team composition validation function
const validateTeamComposition = async (drivers: any[]): Promise<{ valid: boolean; error?: string }> => {
    try {
        // Check team composition rules
        const teamCounts: { [key: string]: number } = {};
        const constructorCounts: { [key: string]: number } = {};
        
        for (const driver of drivers) {
            // Count drivers per team (using teamId)
            if (driver.teamId) {
                teamCounts[driver.teamId] = (teamCounts[driver.teamId] || 0) + 1;
            }
            
            // Count drivers per constructor (using constructorId if available)
            if (driver.constructorId) {
                constructorCounts[driver.constructorId] = (constructorCounts[driver.constructorId] || 0) + 1;
            }
        }
        
        // Rule : Must select exactly 5 drivers
        if (drivers.length !== 5) {
            return { 
                valid: false, 
                error: `Must select exactly 5 drivers. Currently selected: ${drivers.length}` 
            };
        }
        
        return { valid: true };
    } catch (error) {
        return { 
            valid: false, 
            error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
    }
};

exports.createTeam = async(req: Request, res: Response) => {
    try {
        const TOTAL_BUDGET = 100;
        const userId = req.user?._id;
        
        // Add validation for req.body
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is required.'
            });
        }

        const {
            raceId,
            drivers,
            captain
        } = req.body as {
            raceId: string;
            drivers: string[];
            captain?: string;
        }; 

        // Add validation for required fields
        if (!raceId || !drivers || !Array.isArray(drivers)) {
            return res.status(400).json({
                success: false,
                message: 'raceId and drivers array are required.'
            });
        }

        // Find the race document by raceId (e.g., "dutch_2025")
        const raceDocument = await Race.findOne({ raceId: raceId });
        if (!raceDocument) {
            return res.status(400).json({
                success: false,
                message: 'Race not found.'
            });
        }

        // Check if the requested race matches the next race
        const nextRaceData = await getNextRace();
        const nextRaceId = nextRaceData?.raceId;
        
        // Compare the race's raceId with the next race from API
        if (raceDocument.raceId !== nextRaceId) {
            return res.status(400).json({
                success: false,
                message: 'You can only create teams for the next upcoming race.',
                requestedRace: raceDocument.raceId,
                nextRace: nextRaceId
            });
        }

        const lockTime = await lockDate(); 
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        const currentDateObj = new Date(currentDate + 'T00:00:00Z');
        const lockDateObj = new Date(lockTime + 'T00:00:00Z');

        // Compare dates - lock if current date is on or after lock date
        if (currentDateObj >= lockDateObj) {
            return res.status(500).json({
                message: 'Fantasy team creation is locked.',
                lockDate: lockTime,
                currentDate
            });
        }

        const uniqueDrivers = new Set(drivers);
        
        if (uniqueDrivers.size !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Fantasy team must contain exactly 5 unique drivers.'
            });
        }

        // Validate that all driver IDs exist in the database
        const existingDrivers = await Driver.find({ _id: { $in: drivers } });
        if (existingDrivers.length !== drivers.length) {
            const foundDriverIds = existingDrivers.map(driver => driver._id.toString());
            const invalidDriverIds = drivers.filter(driverId => !foundDriverIds.includes(driverId));
            return res.status(400).json({
                success: false,
                message: 'One or more driver IDs are invalid.',
                invalidDriverIds
            });
        }

        // Enhanced team composition validation
        const teamValidation = await validateTeamComposition(existingDrivers);
        if (!teamValidation.valid) {
            return res.status(400).json({
                success: false,
                message: teamValidation.error
            });
        }

        if (captain && !uniqueDrivers.has(captain)) {
            return res.status(400).json({
                success: false,
                message: 'Captain must be one of the selected drivers.'
            });
        }

        // Additional validation: ensure captain is a valid ObjectId if provided
        if (captain && !mongoose.Types.ObjectId.isValid(captain)) {
            return res.status(400).json({
                success: false,
                message: 'Captain must be a valid driver ID.'
            });
        }

        const objectIds = drivers.map(driver => new mongoose.Types.ObjectId(driver));
        const docs = await Driver.find({ _id: { $in: objectIds } });

        let totalCost = 0;
        for (const doc of docs) {
            totalCost += doc.cost; 
        }

        if(totalCost > TOTAL_BUDGET){
            return res.status(500).json({
                success: false,
                message: 'Cost exceeds the budget'
            });
        }
        
        // Check if team already exists for this user and race (using MongoDB _id)
        const existingTeam = await FantasyTeam.findOne({ user: userId, race: raceDocument._id });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Fantasy team already exists for this user.'
            });
        }
        
        // Create new fantasy team (using MongoDB _id for the race field)
        const newTeam = new FantasyTeam({
            user: userId,
            race: raceDocument._id,
            drivers: drivers,
            captain: captain || null,
            points: 0,
            locked: false,
            createdAt: new Date()
        });
        
        await newTeam.save();

        return res.status(200).json({
            success: true,
            message: 'Fantasy team created successfully.',
            data: {
                userId,
                raceId: raceDocument.raceId,
                lockDate: lockTime,
                currentDate,
                totalCost,
                team: {
                    id: newTeam._id,
                    drivers: newTeam.drivers,
                    captain: newTeam.captain,
                    points: newTeam.points,
                    locked: newTeam.locked,
                    createdAt: newTeam.createdAt
                }
            }
        });

    } catch (err) {
        console.error('Failed to create fantasy team:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            message: 'Failed to create fantasy team',
            error: errorMessage
        });
    }
}

exports.getTeam = async(req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { raceId } = req.params; // This is now "dutch_2025" format
        
        if (!userId || !raceId) {
            return res.status(400).json({
                success: false,
                message: "userId and raceId are required"
            });
        }

        // Find the race document by raceId (e.g., "dutch_2025")
        const raceDocument = await Race.findOne({ raceId: raceId });
        if (!raceDocument) {
            return res.status(404).json({
                success: false,
                message: 'Race not found'
            });
        }

        // Find the fantasy team using the race's MongoDB _id
        const result = await FantasyTeam.findOne({ user: userId, race: raceDocument._id })
            .populate('drivers')
            .populate('captain')
            .populate('race')
            .exec();

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Fantasy team not found for this race',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Fantasy team fetched successfully',
            data: result
        });
    }
    catch(err){
        console.log('Error fetching fantasy team:', err);
        return res.status(500).json({
            success: false,
            message: 'Error fetching fantasy team',
            error: err instanceof Error ? err.message : String(err)
        });
    }
}

exports.getUserTeams = async(req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find all fantasy teams for the authenticated user
        const teams = await FantasyTeam.find({ user: userId })
            .populate('drivers')
            .populate('captain')
            .populate('race')
            .sort({ createdAt: -1 }) // Sort by newest first
            .exec();

        return res.status(200).json({
            success: true,
            message: 'User fantasy teams fetched successfully',
            count: teams.length,
            data: teams
        });
    }
    catch(err){
        console.log('Error fetching user fantasy teams:', err);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user fantasy teams',
            error: err instanceof Error ? err.message : String(err)
        });
    }
}

// Helper function to get next race data
const getNextRace = async () => {
    try {
        const { data } = await axios.get('https://f1api.dev/api/current/next', { timeout: 10000 });
        
        const race = Array.isArray(data?.race) ? data.race[0] : data?.race;
        if (!race) {
            throw new Error('Race payload missing from API response');
        }

        return race;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg = (error.response?.data as any)?.message || error.message;
            console.error('HTTP error fetching next race:', status, msg);
        } else {
            console.error('Error fetching next race:', error);
        }
        throw (error instanceof Error) ? error : new Error('Unknown error fetching next race');
    }
}

// Additional 
const lockDate = async (): Promise<string> => {
    try {
        const race = await getNextRace();

        const fp1 = race?.schedule?.fp1;

        const datePart: string | null | undefined = fp1?.date;
        if (!datePart) {
            throw new Error('Lock date not available in schedule');
        }

        // Expect "YYYY-MM-DD"
        const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateOnlyRegex.test(datePart)) {
            throw new Error('Invalid date format in schedule');
        }

        // Ensure it's a valid calendar date
        const ms = Date.parse(`${datePart}T00:00:00Z`);
        if (Number.isNaN(ms)) {
            throw new Error('Unparseable date in schedule');
        }

        return datePart; // e.g., "2025-08-29"
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg = (error.response?.data as any)?.message || error.message;
            console.error('HTTP error fetching lock date:', status, msg);
        } else {
            console.error('Error fetching lock date:', error);
        }
        throw (error instanceof Error) ? error : new Error('Unknown error fetching lock date');
    }
}