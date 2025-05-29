const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get daily report
router.get('/daily', reportController.getDailyReport);

// Get report by date range
router.get('/range', reportController.getReportByDateRange);

module.exports = router;
