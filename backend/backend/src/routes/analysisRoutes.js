const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

// All routes require authentication
router.use(auth);

// Analyze image from base64 data
router.post('/analyze', analysisController.analyzeImage);

// Analyze image from file upload (alternative method)
router.post('/analyze-upload', 
  upload.single('image'), 
  analysisController.analyzeUploadedImage
);

module.exports = router;