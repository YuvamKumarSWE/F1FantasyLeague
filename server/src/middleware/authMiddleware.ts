import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, IUser } from '../models';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const ACCESS_SECRET = process.env.ACCESS_SECRET;

if (!ACCESS_SECRET) {
  throw new Error('ACCESS_SECRET is not defined in environment variables');
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    
    if (!decoded.userId) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    // Fetch the actual user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};