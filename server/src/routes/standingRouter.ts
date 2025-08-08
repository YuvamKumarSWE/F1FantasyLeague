import express from 'express';
const router = express.Router();
const standingController = require('../controllers/standingController');

// GET /api/v1/standings/:year
router.route('/').get(standingController.getStandings);

module.exports = router;
