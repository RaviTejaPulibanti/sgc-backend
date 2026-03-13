// controllers/memberController.js
const Member = require('../models/Member');
const { cloudinary } = require('../utils/upload');

// @desc    Create a new member
// @route   POST /api/members
// @access  Private/ClubAdmin
const createMember = async (req, res) => {
  try {
    const memberData = {
      ...req.body,
      image: req.file ? req.file.path : 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg='
    };

    const member = await Member.create(memberData);
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const { club, role, year, isActive } = req.query;
    const query = {};
    
    if (club) query.club = club;
    if (role) query.role = role;
    if (year) query.year = year;
    if (isActive) query.isActive = isActive === 'true';
    
    const members = await Member.find(query)
      .populate('club', 'name')
      .sort({ role: 1, name: 1 });
    
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

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('club', 'name description');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/ClubAdmin
const updateMember = async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    // Check if club admin has access to this member
    if (req.admin.role === 'club_admin' && member.club.toString() !== req.admin.club.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update members from your club.'
      });
    }
    
    const updateData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      // Delete old image from cloudinary if it's not default
      if (member.image && !member.image.includes('default-avatar')) {
        const publicId = member.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`members/${publicId}`);
      }
      updateData.image = req.file.path;
    }
    
    member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/ClubAdmin
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    
    // Check if club admin has access to this member
    if (req.admin.role === 'club_admin' && member.club.toString() !== req.admin.club.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete members from your club.'
      });
    }
    
    // Delete image from cloudinary if it's not default
    if (member.image && !member.image.includes('default-avatar')) {
      const publicId = member.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`members/${publicId}`);
    }
    
    await member.remove();
    
    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get members by role
// @route   GET /api/members/role/:role
// @access  Public
const getMembersByRole = async (req, res) => {
  try {
    const members = await Member.find({ 
      role: req.params.role,
      isActive: true 
    })
      .populate('club', 'name')
      .sort({ name: 1 });
    
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

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getMembersByRole
};