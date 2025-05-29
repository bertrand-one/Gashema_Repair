const { pool } = require('../config/db');

class ServiceRecord {
  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT sr.*, c.type, c.Model, c.DriverPhone, c.MechanicName, s.ServiceName, s.ServicePrice, u.fullName as ReceiverName
        FROM ServiceRecord sr
        JOIN Cars c ON sr.PlateNumber = c.PlateNumber
        JOIN Services s ON sr.ServiceCode = s.ServiceCode
        JOIN Users u ON sr.ReceivedBy = u.id
        ORDER BY sr.ServiceDate DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error getting all service records:', error);
      throw error;
    }
  }

  static async getById(recordNumber) {
    try {
      const [rows] = await pool.query(`
        SELECT sr.*, c.type, c.Model, c.DriverPhone, c.MechanicName, s.ServiceName, s.ServicePrice, u.fullName as ReceiverName
        FROM ServiceRecord sr
        JOIN Cars c ON sr.PlateNumber = c.PlateNumber
        JOIN Services s ON sr.ServiceCode = s.ServiceCode
        JOIN Users u ON sr.ReceivedBy = u.id
        WHERE sr.RecordNumber = ?
      `, [recordNumber]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting service record by ID:', error);
      throw error;
    }
  }

  static async create(recordData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO ServiceRecord (PlateNumber, ServiceCode, AmountPaid, PaymentDate, ReceivedBy) VALUES (?, ?, ?, ?, ?)',
        [
          recordData.PlateNumber,
          recordData.ServiceCode,
          recordData.AmountPaid,
          recordData.PaymentDate || new Date(),
          recordData.ReceivedBy
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating service record:', error);
      throw error;
    }
  }

  static async update(recordNumber, recordData) {
    try {
      const [result] = await pool.query(
        'UPDATE ServiceRecord SET PlateNumber = ?, ServiceCode = ?, AmountPaid = ?, PaymentDate = ?, ReceivedBy = ? WHERE RecordNumber = ?',
        [
          recordData.PlateNumber,
          recordData.ServiceCode,
          recordData.AmountPaid,
          recordData.PaymentDate || new Date(),
          recordData.ReceivedBy,
          recordNumber
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating service record:', error);
      throw error;
    }
  }

  static async delete(recordNumber) {
    try {
      const [result] = await pool.query('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [recordNumber]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting service record:', error);
      throw error;
    }
  }

  static async getByDateRange(startDate, endDate) {
    try {
      const [rows] = await pool.query(`
        SELECT sr.*, c.type, c.Model, c.DriverPhone, c.MechanicName, s.ServiceName, s.ServicePrice, u.fullName as ReceiverName
        FROM ServiceRecord sr
        JOIN Cars c ON sr.PlateNumber = c.PlateNumber
        JOIN Services s ON sr.ServiceCode = s.ServiceCode
        JOIN Users u ON sr.ReceivedBy = u.id
        WHERE DATE(sr.ServiceDate) BETWEEN ? AND ?
        ORDER BY sr.ServiceDate DESC
      `, [startDate, endDate]);
      return rows;
    } catch (error) {
      console.error('Error getting service records by date range:', error);
      throw error;
    }
  }

  static async getDailyReport(date) {
    try {
      const [rows] = await pool.query(`
        SELECT sr.RecordNumber, sr.PlateNumber, c.type, c.Model, s.ServiceName, sr.AmountPaid, sr.PaymentDate, u.fullName as ReceiverName
        FROM ServiceRecord sr
        JOIN Cars c ON sr.PlateNumber = c.PlateNumber
        JOIN Services s ON sr.ServiceCode = s.ServiceCode
        JOIN Users u ON sr.ReceivedBy = u.id
        WHERE DATE(sr.ServiceDate) = ?
        ORDER BY sr.ServiceDate DESC
      `, [date]);
      return rows;
    } catch (error) {
      console.error('Error getting daily report:', error);
      throw error;
    }
  }

  static async generateBill(recordNumber) {
    try {
      const [rows] = await pool.query(`
        SELECT sr.RecordNumber, sr.PlateNumber, c.type, c.Model, c.DriverPhone, c.MechanicName, 
               s.ServiceName, s.ServicePrice, sr.AmountPaid, sr.PaymentDate, u.fullName as ReceiverName
        FROM ServiceRecord sr
        JOIN Cars c ON sr.PlateNumber = c.PlateNumber
        JOIN Services s ON sr.ServiceCode = s.ServiceCode
        JOIN Users u ON sr.ReceivedBy = u.id
        WHERE sr.RecordNumber = ?
      `, [recordNumber]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error generating bill:', error);
      throw error;
    }
  }
}

module.exports = ServiceRecord;
