import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import driverRouter from './routes/driverRouter';
import constructorRouter from './routes/constructorRouter';
import raceRouter from './routes/raceRoutes';
import userRouter from './routes/userRouter';
import standingRouter from './routes/standingRouter';
import fantasyTeamRouter from './routes/fantasyTeamRouter';
import resultRouter from './routes/resultRoutes';
import leaderboardRouter from './routes/leaderboardRouter';

// Import the scheduler
import { startRaceResultScheduler } from './jobs/raceResultJob';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Trust proxy setting - should be set early
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin:  'https://ykf1-fantasy.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(morgan('dev'));

// Connect to MongoDB
connectDb();

// Start the race result scheduler
startRaceResultScheduler();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express + MongoDB!');
});

app.use('/api/v1/drivers' , driverRouter);
app.use('/api/v1/constructors', constructorRouter);
app.use('/api/v1/races', raceRouter);
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/standings', standingRouter);
app.use('/api/v1/ft', fantasyTeamRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);

// Remove the admin game router for security

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
