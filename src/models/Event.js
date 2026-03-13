// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club reference is required']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  lastRegistrationDate: {
    type: Date,
    required: [true, 'Last registration date is required']
  },
  registrationLink: {
    type: String,
    required: [true, 'Registration link is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required']
  },
  isFinished: {
    type: Boolean,
    default: false
  },
  // Post-event details
  postEventSummary: {
    type: String
  },
  eventImages: [{
    url: String,
    caption: String
  }],
  highlights: [String],
  // Event metadata
  eventType: {
    type: String,
    enum: ['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'],
    required: true
  },
  poster: {
    type: String
  },
  maxParticipants: {
    type: Number
  },
  registeredParticipants: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  // Email tracking
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Check if registration is still open
eventSchema.methods.isRegistrationOpen = function() {
  return new Date() <= this.lastRegistrationDate && !this.isFinished;
};

module.exports = mongoose.model('Event', eventSchema);