// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['GS', 'JS', 'Member'],
    required: [true, 'Role is required']
  },
  position: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'default-avatar.png'
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club reference is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1,
    max: 4
  },
  contactNumber: {
    type: String
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    linkedin: String,
    github: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);