const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get all cars
router.get('/', carController.getAllCars);

// Get car by plate number
router.get('/:plateNumber', carController.getCarByPlateNumber);

// Create a new car
router.post('/', carController.createCar);

// Update a car
router.put('/:plateNumber', carController.updateCar);

// Delete a car
router.delete('/:plateNumber', carController.deleteCar);

module.exports = router;
