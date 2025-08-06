import { Request, Response } from "express";
import { Race, IRace } from "../models";

exports.getRaces = async(req: Request , res: Response) => {
    try{

        const{
            year = '2025',
        } = req.params;

        // Convert year to number
        const yearNumber = parseInt(year as string);

        // Validate year
        if (isNaN(yearNumber) || yearNumber >= 2026 || yearNumber < 2023 ) {
            return res.status(400).json({
                success: false,
                message: "Invalid year parameter",
                data: null
            });
        }

       
        const query: any = {
            sessionName: 'Race',  
            year: yearNumber
        };

        // Build sort object
        const sortObject: any = {};
        sortObject['meetingKey'] = 1;

        const result = await Race.find(query).sort(sortObject);
        
        // Check if no results found
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No races found for year ${yearNumber}`,
                data: {
                    races: [],
                    count: 0,
                    filters: {
                        year: yearNumber,
                        sessionName: 'Race'
                    }
                }
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Races fetched successfully",
            data: {
                races: result,
                count: result.length,
                filters: {
                    year: yearNumber,
                    sessionName: 'Race'
                }
            }
        });
    } catch(error){
        console.error("Error fetching races:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching races",
            error: error instanceof Error ? error.message : String(error),
            data: null
        });
    }
}