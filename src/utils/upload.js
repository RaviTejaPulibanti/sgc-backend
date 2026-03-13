// utils/upload.js
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for member images
const memberStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif','webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Storage for event images
const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif','webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Storage for club logos
const clubStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'clubs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif','webp'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }]
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer upload instances
const uploadMemberImage = multer({
  storage: memberStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const uploadEventImage = multer({
  storage: eventStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const uploadClubLogo = multer({
  storage: clubStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = {
  uploadMemberImage,
  uploadEventImage,
  uploadClubLogo,
  cloudinary
};