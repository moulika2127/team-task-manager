const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.signup
);

// Login
router.post(
  '/login',
  [
    body('email', 'Please provide a valid email').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.login
);

// Get current user
router.get('/me', protect, authController.getMe);

module.exports = router;
