const { pool, initDb } = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', ['admin']);
    
    if (rows.length === 0) {
      // Create admin user
      await User.create({
        username: 'admin',
        password: 'Admin@123',
        fullName: 'Admin User',
        role: 'admin'
      });
      
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const init = async () => {
  try {
    // Initialize database tables
    await initDb();
    
    // Create admin user
    await createAdminUser();
    
    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

init();
