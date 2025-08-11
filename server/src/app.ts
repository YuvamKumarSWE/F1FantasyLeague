import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';


const driverRouter = require('./routes/driverRouter');
const constructorRouter = require('./routes/constructorRouter');
const raceRouter = require('./routes/raceRoutes');
const userRouter = require('./routes/userRouter');
const standingRouter = require('./routes/standingRouter');
const fantasyTeamRouter = require('./routes/fantasyTeamRouter');
import gameRouter from './routes/gameRouter';


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
app.use(cors());
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
app.use('/api/v1/user', userRouter);
app.use('/api/v1/standings', standingRouter);
app.use('/api/v1/ft', fantasyTeamRouter);

app.use('/api/v1/admin/game', gameRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
