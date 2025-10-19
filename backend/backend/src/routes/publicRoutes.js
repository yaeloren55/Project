const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public endpoint - no authentication required
// POST /api/public/analyze-clothing
router.post('/analyze-clothing', publicController.analyzeClothingPublic);

module.exports = router;