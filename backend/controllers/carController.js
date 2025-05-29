const Car = require('../models/Car');

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.getAll();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error getting all cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get car by plate number
exports.getCarByPlateNumber = async (req, res) => {
  try {
    const car = await Car.getByPlateNumber(req.params.plateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Error getting car by plate number:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const { PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;

    // Validate input
    if (!PlateNumber || !type || !Model || !ManufacturingYear || !DriverPhone || !MechanicName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if car already exists
    const existingCar = await Car.getByPlateNumber(PlateNumber);
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this plate number already exists' });
    }

    const success = await Car.create({
      PlateNumber,
      type,
      Model,
      ManufacturingYear,
      DriverPhone,
      MechanicName
    });

    if (!success) {
      return res.status(400).json({ message: 'Failed to create car' });
    }

    res.status(201).json({
      message: 'Car created successfully',
      PlateNumber
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const { type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
    const plateNumber = req.params.plateNumber;

    // Validate input
    if (!type || !Model || !ManufacturingYear || !DriverPhone || !MechanicName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if car exists
    const car = await Car.getByPlateNumber(plateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const success = await Car.update(plateNumber, {
      type,
      Model,
      ManufacturingYear,
      DriverPhone,
      MechanicName
    });

    if (!success) {
      return res.status(400).json({ message: 'Failed to update car' });
    }

    res.status(200).json({ message: 'Car updated successfully' });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;

    // Check if car exists
    const car = await Car.getByPlateNumber(plateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const success = await Car.delete(plateNumber);
    if (!success) {
      return res.status(400).json({ message: 'Failed to delete car' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
