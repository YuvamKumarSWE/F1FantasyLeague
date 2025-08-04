import { Request, Response } from 'express';
import { Constructor, IConstructor } from '../models';


exports.getAllConstructors = async(req: Request , res: Response) => {
    try {

        const result = await Constructor.find({}, {
            constructorId: 1,
            name: 1,
            nationality: 1,
            team_colour: 1,
        });

        return res.status(200).json({
            message: "Constructors fetched successfully",
            data: result 
        }
        );
        
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching constructors",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}