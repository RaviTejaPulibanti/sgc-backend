// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  subscribeUser,
  unsubscribeUser,
  updatePreferences,
  getUserByEmail,
  getSubscribers
} = require('../controllers/userController');
const { protect, superAdminOnly } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribeUser);
router.put('/unsubscribe', unsubscribeUser);
router.put('/preferences', updatePreferences);
router.get('/:email', getUserByEmail);

// Protected routes
router.get('/subscribers/all', protect, superAdminOnly, getSubscribers);

module.exports = router;