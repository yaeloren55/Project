const express = require('express');
const router = express.Router();
const tryOnController = require('../controllers/tryOnController');
const authMiddleware = require('../middleware/auth');

// Generate try-on image
router.post('/generate', authMiddleware, tryOnController.generateTryOn);

module.exports = router;