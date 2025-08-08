import { Driver } from "../models";
import { Request, Response } from "express";

exports.getAllDrivers = async (req: Request, res: Response) => {
    try {
        const { 
            sortBy = 'number', 
            sortOrder = 'asc', 
            search 
        } = req.query;

        // Build search query
        let searchQuery: any = {};
        if (search && typeof search === 'string') {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { surname: { $regex: search, $options: 'i' } },
                    { driverId: { $regex: search, $options: 'i' } },
                    { shortName: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Validate sort field
        const validSortFields = ['driverId', 'name', 'surname', 'shortName', 'teamId', 'number', 'nationality'];
        const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'number';
        
        // Validate sort order
        const order = sortOrder === 'desc' ? -1 : 1;
        
        // Build sort object
        const sortObject: any = {};
        sortObject[sortField] = order;

        const result = await Driver.find(searchQuery).sort(sortObject);
        
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No drivers found",
                data: []
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Drivers fetched successfully",
            data: result,
            count: result.length
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching drivers",
            error: errorMessage,
            data: []
        });
    }
}
