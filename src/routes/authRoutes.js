// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { adminValidation } = require('../utils/validation');

router.post('/register', adminValidation.register, registerAdmin);
router.post('/login', adminValidation.login, loginAdmin);
router.get('/profile', protect, getProfile);

module.exports = router;