// models/Club.js
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Club description is required']
  },
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'academic', 'other'],
    required: true
  },
  logo: {
    type: String,
    default: 'default-club-logo.png'
  },
  coverImage: {
    type: String
  },
  establishedDate: {
    type: Date
  },
  facultyAdvisor: {
    name: String,
    email: String,
    department: String
  },
  socialLinks: {
    instagram: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);