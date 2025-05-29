const { pool } = require('../config/db');

class Service {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM Services');
      return rows;
    } catch (error) {
      console.error('Error getting all services:', error);
      throw error;
    }
  }

  static async getById(serviceCode) {
    try {
      const [rows] = await pool.query('SELECT * FROM Services WHERE ServiceCode = ?', [serviceCode]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting service by ID:', error);
      throw error;
    }
  }

  static async create(serviceData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Services (ServiceName, ServicePrice) VALUES (?, ?)',
        [serviceData.ServiceName, serviceData.ServicePrice]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  static async update(serviceCode, serviceData) {
    try {
      const [result] = await pool.query(
        'UPDATE Services SET ServiceName = ?, ServicePrice = ? WHERE ServiceCode = ?',
        [serviceData.ServiceName, serviceData.ServicePrice, serviceCode]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  static async delete(serviceCode) {
    try {
      const [result] = await pool.query('DELETE FROM Services WHERE ServiceCode = ?', [serviceCode]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}

module.exports = Service;
