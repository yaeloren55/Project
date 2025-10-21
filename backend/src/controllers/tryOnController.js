const tryOnService = require('../services/tryOnService');
const ClothingItem = require('../models/ClothingItem');
const path = require('path');

exports.generateTryOn = async (req, res) => {
  try {
    const { userImage, clothingIds, prompt } = req.body;

    // Validate input
    if (!userImage) {
      return res.status(400).json({
        success: false,
        error: 'User image is required'
      });
    }

    if (!clothingIds || clothingIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one clothing item must be selected'
      });
    }

    // Fetch the clothing items from database
    const clothingItems = await ClothingItem.find({
      _id: { $in: clothingIds },
      user: req.userId
    }).lean();

    if (clothingItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No valid clothing items found'
      });
    }

    // Get the image data for the clothing items (base64 or file paths)
    const clothingImages = clothingItems.map(item => {
      // Use base64 image if available
      if (item.image) {
        return item.image;
      }

      // Fallback to image_url for backward compatibility
      if (item.image_url) {
        // Convert relative paths to absolute paths
        if (item.image_url.startsWith('/uploads/')) {
          return path.join(process.cwd(), item.image_url.substring(1));
        } else if (item.image_url.startsWith('uploads/')) {
          return path.join(process.cwd(), item.image_url);
        }
        return item.image_url;
      }

      return null;
    }).filter(img => img !== null);

    console.log('Processing try-on request with:', {
      clothingCount: clothingImages.length,
      hasPrompt: !!prompt
    });

    // Generate the try-on image
    const result = await tryOnService.generateTryOn(
      userImage,
      clothingImages,
      prompt
    );

    if (result.success) {
      res.json({
        success: true,
        image: result.image
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate try-on image'
      });
    }

  } catch (error) {
    console.error('Try-on controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while generating try-on'
    });
  }
};