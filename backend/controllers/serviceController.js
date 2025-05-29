const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error getting all services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Error getting service by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { ServiceName, ServicePrice } = req.body;

    // Validate input
    if (!ServiceName || !ServicePrice) {
      return res.status(400).json({ message: 'Please provide service name and price' });
    }

    const serviceId = await Service.create({
      ServiceName,
      ServicePrice
    });

    res.status(201).json({
      message: 'Service created successfully',
      serviceId
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { ServiceName, ServicePrice } = req.body;
    const serviceId = req.params.id;

    // Validate input
    if (!ServiceName || !ServicePrice) {
      return res.status(400).json({ message: 'Please provide service name and price' });
    }

    // Check if service exists
    const service = await Service.getById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const success = await Service.update(serviceId, {
      ServiceName,
      ServicePrice
    });

    if (!success) {
      return res.status(400).json({ message: 'Failed to update service' });
    }

    res.status(200).json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    // Check if service exists
    const service = await Service.getById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const success = await Service.delete(serviceId);
    if (!success) {
      return res.status(400).json({ message: 'Failed to delete service' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
