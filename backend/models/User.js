const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Insert the user
      const [result] = await pool.query(
        'INSERT INTO Users (username, password, fullName, role) VALUES (?, ?, ?, ?)',
        [userData.username, hashedPassword, userData.fullName, userData.role]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAllUsers() {
    try {
      const [rows] = await pool.query('SELECT id, username, fullName, role, createdAt FROM Users');
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

module.exports = User;
