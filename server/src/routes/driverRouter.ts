import express, { Application, Request, Response } from 'express';

const driverController = require('../controllers/driverController');
const router = express.Router();

router.route('/').get(driverController.getAllDrivers);
module.exports = router;