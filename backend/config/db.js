const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CRPMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test the connection and create database if needed
const testConnection = async () => {
  try {
    console.log('🔍 Attempting to connect to MySQL...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'CRPMS'}`);

    // First try to connect without specifying database
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();

    // Create database if it doesn't exist
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'CRPMS'}`);
    console.log('✅ Database created/verified successfully');

    // Now test connection to the specific database
    await promisePool.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n🚨 MySQL CONNECTION REFUSED - MySQL is not running!');
      console.error('\n📋 To fix this issue, choose ONE of these options:');
      console.error('\n🔧 OPTION 1: Install and Start MySQL');
      console.error('   1. Download MySQL from: https://dev.mysql.com/downloads/mysql/');
      console.error('   2. Install with default settings');
      console.error('   3. Start MySQL service in Windows Services');
      console.error('\n🔧 OPTION 2: Use XAMPP (Easier)');
      console.error('   1. Download XAMPP from: https://www.apachefriends.org/');
      console.error('   2. Install XAMPP');
      console.error('   3. Open XAMPP Control Panel');
      console.error('   4. Click "Start" next to MySQL');
      console.error('\n🔧 OPTION 3: Use Online MySQL (Cloud)');
      console.error('   1. Create account at: https://www.freemysqlhosting.net/');
      console.error('   2. Update .env file with provided credentials');
      console.error('\n💡 After starting MySQL, restart this server with: npm run dev');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🚨 ACCESS DENIED - Wrong username/password!');
      console.error('💡 Check your .env file credentials');
    } else {
      console.error('\n💡 Make sure MySQL is running and credentials are correct');
    }

    throw error;
  }
};

// Initialize database tables
const initDb = async () => {
  try {
    // Create Users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(100) NOT NULL,
        role ENUM('admin', 'mechanic') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Services table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Services (
        ServiceCode INT AUTO_INCREMENT PRIMARY KEY,
        ServiceName VARCHAR(100) NOT NULL,
        ServicePrice DECIMAL(10, 2) NOT NULL
      )
    `);

    // Create Cars table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Cars (
        PlateNumber VARCHAR(20) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        Model VARCHAR(50) NOT NULL,
        ManufacturingYear INT NOT NULL,
        DriverPhone VARCHAR(20) NOT NULL,
        MechanicName VARCHAR(100) NOT NULL
      )
    `);

    // Create ServiceRecord table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS ServiceRecord (
        RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
        PlateNumber VARCHAR(20) NOT NULL,
        ServiceCode INT NOT NULL,
        ServiceDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        AmountPaid DECIMAL(10, 2) NOT NULL,
        PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ReceivedBy INT NOT NULL,
        FOREIGN KEY (PlateNumber) REFERENCES Cars(PlateNumber),
        FOREIGN KEY (ServiceCode) REFERENCES Services(ServiceCode),
        FOREIGN KEY (ReceivedBy) REFERENCES Users(id)
      )
    `);

    // Insert default services
    await promisePool.query(`
      INSERT IGNORE INTO Services (ServiceName, ServicePrice) VALUES
      ('Engine repair', 150000),
      ('Transmission repair', 80000),
      ('Oil Change', 60000),
      ('Chain replacement', 40000),
      ('Disc replacement', 400000),
      ('Wheel alignment', 5000)
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
    throw error;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  initDb
};
