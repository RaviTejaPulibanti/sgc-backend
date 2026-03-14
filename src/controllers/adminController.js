// controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// @desc    Create a new admin
// @route   POST /api/admins
// @access  Private/SuperAdmin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, club, isActive } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'club_admin',
      club: role === 'club_admin' ? club : undefined,
      isActive: isActive !== undefined ? isActive : true
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      data: adminResponse
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/SuperAdmin
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').populate('club', 'name');
    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin by ID
// @route   GET /api/admins/:id
// @access  Private/SuperAdmin
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password').populate('club', 'name');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

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

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/SuperAdmin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, role, club, isActive } = req.body;
    
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (club !== undefined) admin.club = club;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    const updatedAdmin = await Admin.findById(req.params.id).select('-password').populate('club', 'name');

    res.json({
      success: true,
      data: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};