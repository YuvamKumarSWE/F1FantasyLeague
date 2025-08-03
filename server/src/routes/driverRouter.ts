import express, { Application, Request, Response } from 'express';

const driverController = require('../controllers/driverController');
const router = express.Router();

router.route('/get-all').get(driverController.getAllDrivers);
router.route('/:name').get(driverController.getDriver);
module.exports = router;