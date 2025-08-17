import { authMiddleware } from '../middleware/authMiddleware';
import express from 'express';
const router = express.Router();

const userController = require('../controllers/userController');

router.route('/signup').post(userController.signup);
router.route('/login').post(userController.login);
router.route('/logout').post(userController.logout);
router.route('/me').post(authMiddleware, userController.me);
// router.route('/refresh').post(userController.refresh);

export default router;