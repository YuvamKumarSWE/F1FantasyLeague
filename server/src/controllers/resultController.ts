import { Request, Response } from 'express';
import axios from 'axios';

// Get results for a specific race from external API
export const getRaceResults = async (req: Request, res: Response) => {
    try {
        const { year, round } = req.params;
        
        if (!year || !round) {
            return res.status(400).json({
                success: false,
                message: 'Year and round parameters are required'
            });
        }
        
        const apiUrl = `https://f1api.dev/api/${year}/${round}/race`;
        const response = await axios.get(apiUrl);
        
        if (!response.data || !response.data.races) {
            return res.status(404).json({
                success: false,
                message: 'Race results not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching race results:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching race results from external API',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Calculate fantasy points for a driver result
export const calculateFantasyPoints = (result: any, isCaptain: boolean = false): number => {
    let points = 0;
    
    // Check if driver finished the race (position is a number, not "NC")
    const position = parseInt(result.position);
    const dnf = result.position === "NC" || result.retired !== null;
    
    if (!isNaN(position)) {
        // F1 position points (25, 18, 15, 12, 10, 8, 6, 4, 2, 1 for top 10)
        const positionPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        if (position <= 10) {
            points += positionPoints[position - 1];
        }
        
        // Bonus points
        if (position === 1) points += 10; // Win bonus
        if (position <= 3) points += 5; // Podium bonus
        
        // Penalties for poor performance
        if (position > 15) points -= 2; // Poor finish penalty
    }
    
    // Check for fastest lap bonus
    if (result.fastLap !== null && result.fastLap) {
        points += 5; // Fastest lap bonus
    }
    
    // DNF penalty
    if (dnf) {
        points -= 5;
    }
    
    // Captain gets double points
    return isCaptain ? points * 2 : points;
};

// Get driver's fantasy points for a specific race
export const getDriverFantasyPoints = async (req: Request, res: Response) => {
    try {
        const { year, round, driverId } = req.params;
        const { isCaptain } = req.query;
        
        if (!year || !round || !driverId) {
            return res.status(400).json({
                success: false,
                message: 'Year, round, and driverId parameters are required'
            });
        }
        
        // Get race results from external API
        const apiUrl = `https://f1api.dev/api/${year}/${round}/race`;
        const response = await axios.get(apiUrl);
        
        if (!response.data?.races?.results) {
            return res.status(404).json({
                success: false,
                message: 'Race results not found'
            });
        }
        
        // Find the specific driver's result
        const driverResult = response.data.races.results.find(
            (result: any) => result.driver.driverId === driverId
        );
        
        if (!driverResult) {
            return res.status(404).json({
                success: false,
                message: 'Driver result not found in this race'
            });
        }
        
        const fantasyPoints = calculateFantasyPoints(driverResult, isCaptain === 'true');
        
        return res.status(200).json({
            success: true,
            data: {
                driverId,
                year,
                round,
                position: driverResult.position,
                f1Points: driverResult.points,
                fantasyPoints,
                isCaptain: isCaptain === 'true',
                driverResult
            }
        });
        
    } catch (error) {
        console.error('Error calculating fantasy points:', error);
        return res.status(500).json({
            success: false,
            message: 'Error calculating fantasy points',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// Get all drivers' fantasy points for a specific race
export const getAllDriversFantasyPoints = async (req: Request, res: Response) => {
    try {
        const { year, round } = req.params;
        
        if (!year || !round) {
            return res.status(400).json({
                success: false,
                message: 'Year and round parameters are required'
            });
        }
        
        // Get race results from external API
        const apiUrl = `https://f1api.dev/api/${year}/${round}/race`;
        const response = await axios.get(apiUrl);
        
        if (!response.data?.races?.results) {
            return res.status(404).json({
                success: false,
                message: 'Race results not found'
            });
        }
        
        // Calculate fantasy points for all drivers
        const driversFantasyPoints = response.data.races.results.map((result: any) => {
            const baseFantasyPoints = calculateFantasyPoints(result, false);
            const captainFantasyPoints = calculateFantasyPoints(result, true);
            
            return {
                driverId: result.driver.driverId,
                driverName: `${result.driver.name} ${result.driver.surname}`,
                driverNumber: result.driver.number,
                position: result.position,
                f1Points: result.points,
                fantasyPoints: baseFantasyPoints,
                captainFantasyPoints: captainFantasyPoints,
                team: result.team.teamName,
                dnf: result.position === "NC" || result.retired !== null
            };
        });
        
        return res.status(200).json({
            success: true,
            data: {
                year,
                round,
                raceName: response.data.races.raceName,
                driversFantasyPoints
            }
        });
        
    } catch (error) {
        console.error('Error calculating all drivers fantasy points:', error);
        return res.status(500).json({
            success: false,
            message: 'Error calculating fantasy points for all drivers',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export default {
    getRaceResults,
    getDriverFantasyPoints,
    getAllDriversFantasyPoints,
    calculateFantasyPoints
};