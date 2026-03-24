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
import AIRouter from './routes/AIRouter';

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

// Enhanced Helmet security configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For inline styles
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://f1api.dev"], // Allow F1 API
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  hidePoweredBy: true
}));

app.use(cookieParser());

// CORS configuration using environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // fallback for development

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed origins array
    // Remove the overly permissive regex pattern for better security
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`CORS blocked origin: ${origin}`);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiting: 300 requests per hour
app.use(rateLimit({ 
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 300, // 300 requests per hour
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
app.use(morgan('dev'));

// Connect to MongoDB
connectDb();

// Start the race result scheduler
startRaceResultScheduler();

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use('/api/v1/drivers' , driverRouter);
app.use('/api/v1/constructors', constructorRouter);
app.use('/api/v1/races', raceRouter);
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/standings', standingRouter);
app.use('/api/v1/ft', fantasyTeamRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/leaderboard', leaderboardRouter);
app.use('/api/v1/ai', AIRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
