// controllers/userController.js
const User = require('../models/User');

// @desc    Subscribe user to emails
// @route   POST /api/users/subscribe
// @access  Public
const subscribeUser = async (req, res) => {
  try {
    const { email, name, preferences } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.isSubscribed = true;
      user.name = name || user.name;
      if (preferences) user.emailPreferences = preferences;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email,
        name,
        emailPreferences: preferences || ['all']
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to event notifications',
      data: {
        email: user.email,
        isSubscribed: user.isSubscribed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unsubscribe user from emails
// @route   PUT /api/users/unsubscribe
// @access  Public
const unsubscribeUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.isSubscribed = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from event notifications'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Public
const updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.emailPreferences = preferences;
    await user.save();
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        email: user.email,
        preferences: user.emailPreferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by email
// @route   GET /api/users/:email
// @access  Public
const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all subscribers (Admin only)
// @route   GET /api/users/subscribers
// @access  Private/SuperAdmin
const getSubscribers = async (req, res) => {
  try {
    const users = await User.find({ isSubscribed: true })
      .sort({ subscriptionDate: -1 });
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  subscribeUser,
  unsubscribeUser,
  updatePreferences,
  getUserByEmail,
  getSubscribers
};