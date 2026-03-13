// controllers/clubController.js
const Club = require('../models/Club');
const Member = require('../models/Member');
const Event = require('../models/Event');

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private/SuperAdmin
const createClub = async (req, res) => {
  try {
    const clubData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const club = await Club.create(clubData);
    
    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (isActive) query.isActive = isActive === 'true';
    
    const clubs = await Club.find(query)
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    // Get club statistics
    const membersCount = await Member.countDocuments({ club: club._id, isActive: true });
    const eventsCount = await Event.countDocuments({ club: club._id });
    const upcomingEvents = await Event.countDocuments({ 
      club: club._id, 
      isFinished: false,
      eventDate: { $gte: new Date() }
    });
    
    const clubData = club.toObject();
    clubData.stats = {
      members: membersCount,
      totalEvents: eventsCount,
      upcomingEvents
    };
    
    res.json({
      success: true,
      data: clubData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private/SuperAdmin
const updateClub = async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    club = await Club.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private/SuperAdmin
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    // Check if club has members or events
    const membersCount = await Member.countDocuments({ club: club._id });
    const eventsCount = await Event.countDocuments({ club: club._id });
    
    if (membersCount > 0 || eventsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete club with existing members or events. Deactivate it instead.'
      });
    }
    
    await club.remove();
    
    res.json({
      success: true,
      message: 'Club deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get club members
// @route   GET /api/clubs/:id/members
// @access  Public
const getClubMembers = async (req, res) => {
  try {
    const members = await Member.find({ 
      club: req.params.id,
      isActive: true 
    }).sort({ role: 1, name: 1 });
    
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get club events
// @route   GET /api/clubs/:id/events
// @access  Public
const getClubEvents = async (req, res) => {
  try {
    const { isFinished, limit = 10 } = req.query;
    const query = { club: req.params.id };
    
    if (isFinished !== undefined) {
      query.isFinished = isFinished === 'true';
    }
    
    const events = await Event.find(query)
      .sort({ eventDate: -1 })
      .limit(parseInt(limit));
    
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
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  getClubMembers,
  getClubEvents
};