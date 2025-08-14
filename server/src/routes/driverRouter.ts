import express, { Application, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const driverController = require('../controllers/driverController');
const router = express.Router();

router.route('/').get( driverController.getAllDrivers);
export default router;