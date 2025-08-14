import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import driverRouter from './routes/driverRouter';
import constructorRouter from './routes/constructorRouter';
import raceRouter from './routes/raceRoutes';
import userRouter from './routes/userRouter';
import standingRouter from './routes/standingRouter';
import fantasyTeamRouter from './routes/fantasyTeamRouter';
import resultRouter from './routes/resultRoutes';
import gameRouter from './routes/gameRouter';
import leaderboardRouter from './routes/leaderboardRouter';


dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Parses incoming JSON requests and makes the data available in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Adds security headers to protect against common vulnerabilities (XSS, clickjacking, etc.)
app.use(helmet());
// Enables Cross-Origin Resource Sharing - allows frontend from different domains to access this API
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Specific origin, not wildcard
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Logs HTTP requests to the console for debugging and monitoring
app.use(morgan('dev'));

// Connect to MongoDB
connectDb();

// Routes
app.get('/', (req: Request, res: Response) => {               // For type safety of res and rep
  res.send('Hello from TypeScript + Express + MongoDB!');
});

app.use('/api/v1/drivers' , driverRouter);
app.use('/api/v1/constructors', constructorRouter);
app.use('/api/v1/races', raceRouter);
app.use('/api/v1/users', userRouter); // Changed from 'user' to 'users' to match frontend
app.use('/api/v1/standings', standingRouter);
app.use('/api/v1/ft', fantasyTeamRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);

app.use('/api/v1/admin/game', gameRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
