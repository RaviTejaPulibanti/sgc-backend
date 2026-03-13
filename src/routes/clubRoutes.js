// routes/clubRoutes.js
const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  getClubMembers,
  getClubEvents
} = require('../controllers/clubController');
const { protect, superAdminOnly, clubAdminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getClubs);
router.get('/:id', getClubById);
router.get('/:id/members', getClubMembers);
router.get('/:id/events', getClubEvents);

// Protected routes
router.post('/', protect, superAdminOnly, createClub);
router.put('/:id', protect, superAdminOnly, updateClub);
router.delete('/:id', protect, superAdminOnly, deleteClub);

module.exports = router;