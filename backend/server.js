const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, initDb } = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const carRoutes = require('./routes/carRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('SmartPark Car Repair Management System API');
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

// Test database connection and initialize tables
const startServer = async () => {
  try {
    console.log('🚀 Starting SmartPark Car Repair Management System...');
    console.log('📊 Testing database connection...');

    await testConnection();

    console.log('🔧 Initializing database tables...');
    await initDb();

    app.listen(PORT, () => {
      console.log('✅ Server started successfully!');
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log('📋 Available endpoints:');
      console.log('   - GET  /                     - API Info');
      console.log('   - POST /api/auth/login       - User Login');
      console.log('   - POST /api/auth/register    - User Registration');
      console.log('   - GET  /api/services         - Get Services');
      console.log('   - GET  /api/cars             - Get Cars');
      console.log('   - GET  /api/service-records  - Get Service Records');
      console.log('   - GET  /api/reports          - Get Reports');
      console.log('');
      console.log('💡 Press Ctrl+C to stop the server');
      console.log('🔄 Server will auto-restart on file changes (nodemon)');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Make sure MySQL is running and database credentials are correct');
    process.exit(1);
  }
};

startServer();
