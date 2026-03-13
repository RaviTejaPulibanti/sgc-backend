// middleware/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin not found'
        });
      }

      if (!req.admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super admin only.'
    });
  }
};

const clubAdminOnly = (req, res, next) => {
  if (req.admin && (req.admin.role === 'super_admin' || req.admin.role === 'club_admin')) {
    // For club admins, check if they have access to the requested club
    if (req.admin.role === 'club_admin' && req.params.clubId) {
      if (req.admin.club.toString() !== req.params.clubId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own club.'
        });
      }
    }
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

module.exports = { protect, superAdminOnly, clubAdminOnly };