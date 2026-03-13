// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');
const { protect, superAdminOnly } = require('../middleware/auth');

router.use(protect, superAdminOnly);

router.route('/')
  .get(getAdmins);

router.route('/:id')
  .get(getAdminById)
  .put(updateAdmin)
  .delete(deleteAdmin);

module.exports = router;