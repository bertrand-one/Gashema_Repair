const ServiceRecord = require('../models/ServiceRecord');
const Car = require('../models/Car');
const Service = require('../models/Service');

// Get all service records
exports.getAllServiceRecords = async (req, res) => {
  try {
    const records = await ServiceRecord.getAll();
    res.status(200).json(records);
  } catch (error) {
    console.error('Error getting all service records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service record by ID
exports.getServiceRecordById = async (req, res) => {
  try {
    const record = await ServiceRecord.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Service record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error getting service record by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new service record
exports.createServiceRecord = async (req, res) => {
  try {
    const { PlateNumber, ServiceCode, AmountPaid, PaymentDate } = req.body;

    // Validate input
    if (!PlateNumber || !ServiceCode || !AmountPaid) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if car exists
    const car = await Car.getByPlateNumber(PlateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if service exists
    const service = await Service.getById(ServiceCode);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const recordId = await ServiceRecord.create({
      PlateNumber,
      ServiceCode,
      AmountPaid,
      PaymentDate: PaymentDate || new Date(),
      ReceivedBy: req.user.id
    });

    res.status(201).json({
      message: 'Service record created successfully',
      recordId
    });
  } catch (error) {
    console.error('Error creating service record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service record
exports.updateServiceRecord = async (req, res) => {
  try {
    const { PlateNumber, ServiceCode, AmountPaid, PaymentDate } = req.body;
    const recordId = req.params.id;

    // Validate input
    if (!PlateNumber || !ServiceCode || !AmountPaid) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if record exists
    const record = await ServiceRecord.getById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Check if car exists
    const car = await Car.getByPlateNumber(PlateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if service exists
    const service = await Service.getById(ServiceCode);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const success = await ServiceRecord.update(recordId, {
      PlateNumber,
      ServiceCode,
      AmountPaid,
      PaymentDate: PaymentDate || record.PaymentDate,
      ReceivedBy: record.ReceivedBy
    });

    if (!success) {
      return res.status(400).json({ message: 'Failed to update service record' });
    }

    res.status(200).json({ message: 'Service record updated successfully' });
  } catch (error) {
    console.error('Error updating service record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a service record
exports.deleteServiceRecord = async (req, res) => {
  try {
    const recordId = req.params.id;

    // Check if record exists
    const record = await ServiceRecord.getById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Service record not found' });
    }

    const success = await ServiceRecord.delete(recordId);
    if (!success) {
      return res.status(400).json({ message: 'Failed to delete service record' });
    }

    res.status(200).json({ message: 'Service record deleted successfully' });
  } catch (error) {
    console.error('Error deleting service record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate bill for a service record
exports.generateBill = async (req, res) => {
  try {
    const recordId = req.params.id;
    const bill = await ServiceRecord.generateBill(recordId);
    
    if (!bill) {
      return res.status(404).json({ message: 'Service record not found' });
    }
    
    res.status(200).json(bill);
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
