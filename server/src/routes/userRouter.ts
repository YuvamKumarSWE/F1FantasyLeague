import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();

const userController = require('../controllers/userController');

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.route('/logout').post(userController.logout);
router.route('/me').get(authMiddleware, userController.me)

export default router;