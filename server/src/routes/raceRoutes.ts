import express from 'express';
const router = express.Router();
const raceController = require('../controllers/raceController');

router.route('/:year').get(raceController.getRaces);

module.exports=router;