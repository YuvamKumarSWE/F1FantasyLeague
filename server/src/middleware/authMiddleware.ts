import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import dotenv from 'dotenv';

dotenv.config();

declare global{
    namespace Express {
        interface Request {
            user?: IUser; 
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed.",
                data: null
            });
            return;
        }
        
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found.",
                data: null
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
       
    }
}