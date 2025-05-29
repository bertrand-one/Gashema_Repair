const { pool } = require('../config/db');

class Car {
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM Cars');
      return rows;
    } catch (error) {
      console.error('Error getting all cars:', error);
      throw error;
    }
  }

  static async getByPlateNumber(plateNumber) {
    try {
      const [rows] = await pool.query('SELECT * FROM Cars WHERE PlateNumber = ?', [plateNumber]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting car by plate number:', error);
      throw error;
    }
  }

  static async create(carData) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Cars (PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)',
        [
          carData.PlateNumber,
          carData.type,
          carData.Model,
          carData.ManufacturingYear,
          carData.DriverPhone,
          carData.MechanicName
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  static async update(plateNumber, carData) {
    try {
      const [result] = await pool.query(
        'UPDATE Cars SET type = ?, Model = ?, ManufacturingYear = ?, DriverPhone = ?, MechanicName = ? WHERE PlateNumber = ?',
        [
          carData.type,
          carData.Model,
          carData.ManufacturingYear,
          carData.DriverPhone,
          carData.MechanicName,
          plateNumber
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  static async delete(plateNumber) {
    try {
      const [result] = await pool.query('DELETE FROM Cars WHERE PlateNumber = ?', [plateNumber]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }
}

module.exports = Car;
