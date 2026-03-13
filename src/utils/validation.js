// utils/validation.js
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const adminValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('role').optional().isIn(['super_admin', 'club_admin']),
    body('club').optional().isMongoId(),
    validateRequest
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validateRequest
  ]
};

const memberValidation = {
  create: [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(['GS', 'JS', 'Member']),
    body('club').isMongoId(),
    body('department').notEmpty(),
    body('year').isInt({ min: 1, max: 4 }),
    validateRequest
  ]
};

const eventValidation = {
  create: [
    body('name').notEmpty().trim(),
    body('description').notEmpty(),
    body('club').isMongoId(),
    body('eventDate').isISO8601().toDate(),
    body('lastRegistrationDate').isISO8601().toDate(),
    body('registrationLink').isURL(),
    body('venue').notEmpty(),
    body('eventType').isIn(['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other']),
    validateRequest
  ]
};

module.exports = {
  adminValidation,
  memberValidation,
  eventValidation
};