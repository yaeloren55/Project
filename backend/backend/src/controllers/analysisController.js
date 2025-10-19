const clothingAnalysisService = require('../services/clothingAnalysisService');
const { validationResult } = require('express-validator');

/**
 * Analyze clothing image using AI
 */
exports.analyzeImage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Analyze the image
    const result = await clothingAnalysisService.analyzeClothingImage(image);

    if (!result.success) {
      // Still return the data even if analysis partially failed
      return res.status(200).json({
        success: false,
        message: result.error || 'Analysis completed with fallback data',
        analysis: result.data
      });
    }

    res.json({
      success: true,
      message: 'Image analyzed successfully',
      analysis: result.data
    });
  } catch (error) {
    console.error('Analysis controller error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
};

/**
 * Analyze image from file upload (alternative method)
 */
exports.analyzeUploadedImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Convert uploaded file to base64
    const base64Image = clothingAnalysisService.imageToBase64(req.file.buffer);

    // Analyze the image
    const result = await clothingAnalysisService.analyzeClothingImage(base64Image);

    if (!result.success) {
      return res.status(200).json({
        success: false,
        message: result.error || 'Analysis completed with fallback data',
        analysis: result.data
      });
    }

    res.json({
      success: true,
      message: 'Image analyzed successfully',
      analysis: result.data
    });
  } catch (error) {
    console.error('Analysis controller error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
};