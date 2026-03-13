// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getMembersByRole
} = require('../controllers/memberController');
const { protect, clubAdminOnly } = require('../middleware/auth');
const { uploadMemberImage } = require('../utils/upload');
const { memberValidation } = require('../utils/validation');

// Public routes
router.get('/', getMembers);
router.get('/role/:role', getMembersByRole);
router.get('/:id', getMemberById);

// Protected routes
router.post(
  '/', 
  protect, 
  clubAdminOnly,
  uploadMemberImage.single('image'),
  memberValidation.create,
  createMember
);

router.put(
  '/:id', 
  protect, 
  clubAdminOnly,
  uploadMemberImage.single('image'),
  updateMember
);

router.delete('/:id', protect, clubAdminOnly, deleteMember);

module.exports = router;