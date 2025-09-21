const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/summary', aiController.getSummary);
router.get('/report', aiController.getReportLink);

module.exports = router;