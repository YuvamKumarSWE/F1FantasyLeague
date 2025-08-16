import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET) {
  throw new Error('ACCESS_SECRET is not defined in environment variables');
}
if (!REFRESH_SECRET) {
  throw new Error('REFRESH_SECRET is not defined in environment variables');
}

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET as string, { expiresIn: '1m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET as string, { expiresIn: '7d' });
};


