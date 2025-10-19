const clothingAnalysisService = require('../services/clothingAnalysisService');

// Public endpoint for clothing analysis - no authentication required
exports.analyzeClothingPublic = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }

    // Check if image is base64
    const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
    if (!base64Regex.test(image)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image format. Please provide a base64 encoded image.'
      });
    }

    console.log('Public API: Processing clothing analysis request');

    // Use the existing analysis service
    const analysisResult = await clothingAnalysisService.analyzeClothingImage(image);

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        error: analysisResult.error || 'Failed to analyze image'
      });
    }

    // Return the analysis without saving to database
    res.json({
      success: true,
      data: {
        analysis: analysisResult.data,
        message: 'Clothing analysis completed successfully'
      }
    });

  } catch (error) {
    console.error('Public clothing analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during analysis'
    });
  }
};