// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addPostEventDetails,
  getUpcomingEvents
} = require('../controllers/eventController');
const { protect, clubAdminOnly } = require('../middleware/auth');
const { uploadEventImage } = require('../utils/upload');
const { eventValidation } = require('../utils/validation');

// Public routes
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);

// Protected routes
router.post(
  '/',
  protect,
  clubAdminOnly,
  uploadEventImage.single('poster'),
  eventValidation.create,
  createEvent
);

router.put(
  '/:id',
  protect,
  clubAdminOnly,
  uploadEventImage.single('poster'),
  updateEvent
);

router.put(
  '/:id/post-event',
  protect,
  clubAdminOnly,
  uploadEventImage.array('eventImages', 10),
  addPostEventDetails
);

router.delete('/:id', protect, clubAdminOnly, deleteEvent);

module.exports = router;