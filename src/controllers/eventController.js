// controllers/eventController.js
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const { cloudinary } = require('../utils/upload');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/ClubAdmin
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.admin._id,
      poster: req.file ? req.file.path : null
    };

    const event = await Event.create(eventData);
    
    // Get club details for email
    const club = await Club.findById(event.club);
    
    // Send emails to subscribed users
    if (event.lastRegistrationDate > new Date()) {
      await emailService.sendEventEmails(event, club);
    }
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { 
      club, 
      eventType, 
      isFinished, 
      featured,
      startDate,
      endDate,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const query = {};
    
    if (club) query.club = club;
    if (eventType) query.eventType = eventType;
    if (isFinished !== undefined) query.isFinished = isFinished === 'true';
    if (featured !== undefined) query.isFeatured = featured === 'true';
    
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) query.eventDate.$gte = new Date(startDate);
      if (endDate) query.eventDate.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const events = await Event.find(query)
      .populate('club', 'name logo')
      .sort({ eventDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Event.countDocuments(query);
    
    res.json({
      success: true,
      data: events,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name description logo')
      .populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/ClubAdmin
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if club admin has access to this event
    if (req.admin.role === 'club_admin' && event.club.toString() !== req.admin.club.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update events from your club.'
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle poster upload
    if (req.file) {
      // Delete old poster from cloudinary
      if (event.poster) {
        const publicId = event.poster.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      }
      updateData.poster = req.file.path;
    }
    
    event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/ClubAdmin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if club admin has access to this event
    if (req.admin.role === 'club_admin' && event.club.toString() !== req.admin.club.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete events from your club.'
      });
    }
    
    // Delete poster from cloudinary
    if (event.poster) {
      const publicId = event.poster.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`events/${publicId}`);
    }
    
    // Delete event images
    if (event.eventImages && event.eventImages.length > 0) {
      for (const image of event.eventImages) {
        const publicId = image.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      }
    }
    
    await event.remove();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add post-event details
// @route   PUT /api/events/:id/post-event
// @access  Private/ClubAdmin
const addPostEventDetails = async (req, res) => {
  try {
    const { summary, highlights } = req.body;
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if club admin has access
    if (req.admin.role === 'club_admin' && event.club.toString() !== req.admin.club.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    let eventImages = event.eventImages || [];
    
    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        caption: file.originalname
      }));
      eventImages = [...eventImages, ...newImages];
    }
    
    event.postEventSummary = summary || event.postEventSummary;
    event.highlights = highlights ? highlights.split(',').map(h => h.trim()) : event.highlights;
    event.eventImages = eventImages;
    event.isFinished = true;
    
    await event.save();
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isFinished: false,
      eventDate: { $gte: new Date() }
    })
      .populate('club', 'name')
      .sort({ eventDate: 1 })
      .limit(10);
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addPostEventDetails,
  getUpcomingEvents
};