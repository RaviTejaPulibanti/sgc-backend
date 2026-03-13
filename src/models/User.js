// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  },
  emailPreferences: {
    type: [String],
    enum: ['technical', 'cultural', 'sports', 'academic', 'all'],
    default: ['all']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);