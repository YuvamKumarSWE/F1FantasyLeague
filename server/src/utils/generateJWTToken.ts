import jwt from 'jsonwebtoken';
import { IUser } from '../models';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user : IUser) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const payload  = {
        id: (user._id as string).toString(),
        email: user.email
    };
    
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h' 
    });
    return token;

}