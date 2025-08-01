import { Driver } from "../models";
import { Request, Response } from "express";

exports.getAllDrivers = async (req: Request, res: Response) => {
    const result = await Driver.find({ code: "NOR"  });
    if (!result) {
        return res.status(404).json({ message: "No drivers found" });
    }
    return res.status(200).json(result);
}