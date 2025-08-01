import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db';
import helmet from 'helmet';
import cors from 'cors';

const driverRouter = require('./routes/driverRouter');

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Parses incoming JSON requests and makes the data available in req.body
app.use(express.json());
// Adds security headers to protect against common vulnerabilities (XSS, clickjacking, etc.)
app.use(helmet());
// Enables Cross-Origin Resource Sharing - allows frontend from different domains to access this API
app.use(cors());

// Connect to MongoDB
connectDb();

// Routes
app.get('/', (req: Request, res: Response) => {               // For type safety of res and rep
  res.send('Hello from TypeScript + Express + MongoDB!');
});

app.use('/api/v1/drivers' , driverRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
