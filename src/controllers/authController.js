// controllers/authController.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public (should be protected in production)
const registerAdmin = async (req, res) => {
  try {
    const { email, password, name, role, club } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      email,
      password,
      name,
      role: role || 'club_admin',
      club: role === 'club_admin' ? club : undefined
    });

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        club: admin.club,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);

    // IMPORTANT: Select the password field explicitly
    const admin = await Admin.findOne({ email })
      .select('+password')  // This is crucial!
      .populate('club', 'name');

    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Stored hashed password:', admin.password);

    // Check if comparePassword method exists
    if (typeof admin.comparePassword !== 'function') {
      console.error('comparePassword method not found on admin object');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact super admin.'
      });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      success: true,
      data: {
        ...adminResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .select('-password')
      .populate('club');
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile
};