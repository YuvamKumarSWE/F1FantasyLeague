import { Request, Response } from "express";
import { Race, IRace } from "../models";

exports.getRaces = async (req: Request, res: Response) => {
  try {
    const { year = '2025' } = req.query;

    const yearNumber = parseInt(year as string, 10);
    if (isNaN(yearNumber) || yearNumber >= 2026 || yearNumber < 2023) {
      return res.status(400).json({
        success: false,
        message: "Invalid year parameter",
        data: null
      });
    }

    const query = { year: yearNumber };
    const sort = { round: 1 as 1 };

    const result = await Race.find(query).sort(sort);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No races found for year ${yearNumber}`,
        data: {
          races: [],
          count: 0,
          filters: { year: yearNumber }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Races fetched successfully",
      count: result.length,
      filters: { year: yearNumber },
      data: result,
    });
  } catch (error) {
    console.error("Error fetching races:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching races",
      error: error instanceof Error ? error.message : String(error),
      data: null
    });
  }
};

// Get current race (next upcoming race)
exports.getCurrentRace = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const currentRace = await Race.findOne({
      'schedule.race': { $gte: now }
    }).sort({ 'schedule.race': 1 });
    
    if (!currentRace) {
      return res.status(404).json({
        success: false,
        message: 'No upcoming races found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Current race fetched successfully',
      data: currentRace
    });
  } catch (error) {
    console.error("Error fetching current race:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching current race',
      error: error instanceof Error ? error.message : String(error),
      data: null
    });
  }
};

// Get completed races
exports.getCompletedRaces = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const { year = '2025', limit = '10' } = req.query;
    
    const yearNumber = parseInt(year as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    
    if (isNaN(yearNumber) || yearNumber >= 2026 || yearNumber < 2023) {
      return res.status(400).json({
        success: false,
        message: "Invalid year parameter",
        data: null
      });
    }

    const completedRaces = await Race.find({
      year: yearNumber,
      'schedule.race': { $lt: now }
    })
    .sort({ 'schedule.race': -1 })
    .limit(limitNumber);
    
    return res.status(200).json({
      success: true,
      message: 'Completed races fetched successfully',
      count: completedRaces.length,
      data: completedRaces
    });
  } catch (error) {
    console.error("Error fetching completed races:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching completed races',
      error: error instanceof Error ? error.message : String(error),
      data: null
    });
  }
};

// Get upcoming races
exports.getUpcomingRaces = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const { year = '2025', limit = '5' } = req.query;
    
    const yearNumber = parseInt(year as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    
    if (isNaN(yearNumber) || yearNumber >= 2026 || yearNumber < 2023) {
      return res.status(400).json({
        success: false,
        message: "Invalid year parameter",
        data: null
      });
    }

    const upcomingRaces = await Race.find({
      year: yearNumber,
      'schedule.race': { $gte: now }
    })
    .sort({ 'schedule.race': 1 })
    .limit(limitNumber);
    
    return res.status(200).json({
      success: true,
      message: 'Upcoming races fetched successfully',
      count: upcomingRaces.length,
      data: upcomingRaces
    });
  } catch (error) {
    console.error("Error fetching upcoming races:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching upcoming races',
      error: error instanceof Error ? error.message : String(error),
      data: null
    });
  }
};

// Get race status (completed, upcoming, current)
exports.getRaceStatus = async (req: Request, res: Response) => {
  try {
    const { raceId } = req.params;
    
    if (!raceId) {
      return res.status(400).json({
        success: false,
        message: 'Race ID is required',
        data: null
      });
    }

    const race = await Race.findById(raceId);
    
    if (!race) {
      return res.status(404).json({
        success: false,
        message: 'Race not found',
        data: null
      });
    }

    const now = new Date();
    const raceDate = race.schedule.race ? new Date(race.schedule.race) : null;
    const fp1Date = race.schedule.fp1 ? new Date(race.schedule.fp1) : null;
    
    let status: string;
    let teamCreationLocked = false;
    
    if (raceDate && raceDate < now) {
      status = 'completed';
      teamCreationLocked = true;
    } else if (fp1Date && fp1Date <= now) {
      status = 'current';
      teamCreationLocked = true;
    } else {
      status = 'upcoming';
      teamCreationLocked = false;
    }
    
    return res.status(200).json({
      success: true,
      message: 'Race status fetched successfully',
      data: {
        race,
        status,
        teamCreationLocked,
        raceDate,
        fp1Date,
        currentTime: now
      }
    });
  } catch (error) {
    console.error("Error fetching race status:", error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching race status',
      error: error instanceof Error ? error.message : String(error),
      data: null
    });
  }
};