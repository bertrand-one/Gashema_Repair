const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictToAdmin } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', protect, authController.getCurrentUser);

// Get all users (admin only)
router.get('/users', protect, restrictToAdmin, authController.getAllUsers);

module.exports = router;
