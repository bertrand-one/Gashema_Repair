const ServiceRecord = require('../models/ServiceRecord');

// Get daily report
exports.getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Validate date
    if (!date) {
      return res.status(400).json({ message: 'Please provide a date' });
    }
    
    const report = await ServiceRecord.getDailyReport(date);
    
    // Calculate total amount
    const totalAmount = report.reduce((sum, record) => sum + parseFloat(record.AmountPaid), 0);
    
    res.status(200).json({
      date,
      totalAmount,
      records: report
    });
  } catch (error) {
    console.error('Error getting daily report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get report by date range
exports.getReportByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide start and end dates' });
    }
    
    const records = await ServiceRecord.getByDateRange(startDate, endDate);
    
    // Calculate total amount
    const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.AmountPaid), 0);
    
    // Group by service
    const serviceGroups = {};
    records.forEach(record => {
      if (!serviceGroups[record.ServiceName]) {
        serviceGroups[record.ServiceName] = {
          count: 0,
          total: 0
        };
      }
      serviceGroups[record.ServiceName].count += 1;
      serviceGroups[record.ServiceName].total += parseFloat(record.AmountPaid);
    });
    
    res.status(200).json({
      startDate,
      endDate,
      totalAmount,
      serviceGroups,
      records
    });
  } catch (error) {
    console.error('Error getting report by date range:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
