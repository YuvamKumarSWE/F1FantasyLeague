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
const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.[COOKIE_NAME];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated (missing token).',
                data: null,
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {id: string};
        const user = await User.findById(decoded.id).select('_id email username role createdAt');
        if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found for token.',
            data: null,
        });
        }

        req.user = user;
        return next();

    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
        return;
    }
}