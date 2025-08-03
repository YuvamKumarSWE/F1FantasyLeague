import { Driver } from "../models";
import { Request, Response } from "express";

exports.getAllDrivers = async (req: Request, res: Response) => {
    try {
        const result = await Driver.find({}).sort({ driverNumber: 1 });
        
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No drivers found" });
        }
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: "Error fetching drivers", error: errorMessage });
    }
}

exports.getDriver = async (req: Request, res: Response) => {
    try {
        const name: string = req.params.name;
        
        // Create case-insensitive regex for partial matching
        const searchRegex = new RegExp(name, 'i');
        
        const result = await Driver.find({
            $or: [
                { givenName: { $regex: searchRegex } },
                { familyName: { $regex: searchRegex } }
            ]
        });
        
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No drivers found matching the search criteria" });
        }
        return res.status(200).json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: "Error searching for drivers", error: errorMessage });
    }
}