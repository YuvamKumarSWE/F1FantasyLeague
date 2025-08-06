import express from 'express';

const resultController = require('../controllers/resultController');
const router = express.Router();

router.route('/').get(resultController.getResults);
module.exports = router;