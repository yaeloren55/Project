const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Analyze image from base64 data
router.post('/analyze', analysisController.analyzeImage);

module.exports = router;