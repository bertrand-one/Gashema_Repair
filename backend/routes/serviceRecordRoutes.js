const express = require('express');
const router = express.Router();
const serviceRecordController = require('../controllers/serviceRecordController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get all service records
router.get('/', serviceRecordController.getAllServiceRecords);

// Get service record by ID
router.get('/:id', serviceRecordController.getServiceRecordById);

// Create a new service record
router.post('/', serviceRecordController.createServiceRecord);

// Update a service record
router.put('/:id', serviceRecordController.updateServiceRecord);

// Delete a service record
router.delete('/:id', serviceRecordController.deleteServiceRecord);

// Generate bill for a service record
router.get('/:id/bill', serviceRecordController.generateBill);

module.exports = router;
