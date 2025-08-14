import express from 'express';
const router = express.Router();
const constructorController = require('../controllers/constructorController');

router.route('/').get(constructorController.getAllConstructors);

export default router;