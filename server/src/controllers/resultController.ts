import { Request, Response } from "express";
import { Result, Driver, Race } from "../models";

exports.getResults = async(req: Request, res: Response) => {
    try {

        const {
            sessionKey,
            raceId,
            driverId,
            driverNumber,
            meetingKey
        } = req.query; // Changed from req.params to req.query

        let searchQuery : any = {}

        if (sessionKey) {
            searchQuery.sessionKey = Number(sessionKey);
        }
        if (raceId) {
            searchQuery.race = raceId;
        }
        if (driverId) {
            searchQuery.driver = driverId;
        }

        if (meetingKey) {
            const race = await Race.findOne({ meetingKey: Number(meetingKey) });
            if (!race) {
                return res.status(404).json({
                    success: false,
                    message: `Race with meeting key ${meetingKey} not found`,
                    data: []
                });
            }
            searchQuery.race = race._id;
        }

        if (driverNumber) {
            const driver = await Driver.findOne({ driverNumber: Number(driverNumber) });
            if (!driver) {
                return res.status(404).json({
                    success: false,
                    message: `Driver with number ${driverNumber} not found`,
                    data: []
                });
            }
            searchQuery.driver = driver._id;
        }

        const result = await Result.find(searchQuery)
            .populate('race', 'sessionName countryName circuitShortName dateStart year meetingKey sessionKey')
            .populate('driver', 'fullName driverNumber code teamName')
            .sort({ position: 1 }); 
            
        return res.status(200).json({
            success: true,
            data: result,
            message: "Results fetched successfully",
            count: result.length,
            filters: searchQuery
        });

    } catch (error) {
        console.error("Error fetching results:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
            error: error instanceof Error ? error.message : String(error)
        });
        
    }
}