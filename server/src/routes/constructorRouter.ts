import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();
const constructorController = require('../controllers/constructorController');

router.route('/').get(authMiddleware, constructorController.getAllConstructors);

export default router;