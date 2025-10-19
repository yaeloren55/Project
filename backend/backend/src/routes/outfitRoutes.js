const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');
const auth = require('../middleware/auth');
const { validateOutfitSuggestion } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Get outfit suggestions
router.post('/suggest', validateOutfitSuggestion, outfitController.suggestOutfits);

// Get available occasions
router.get('/occasions', outfitController.getOccasions);

// AI-powered outfit suggestions
router.post('/suggest-ai', outfitController.suggestOutfitsWithAI);

module.exports = router;