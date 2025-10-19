const ClothingItem = require('../models/ClothingItem');
const outfitSuggestionService = require('../services/outfitSuggestionService');

// Outfit rules based on occasion
const outfitRules = {
  casual: {
    tops: ['T-Shirt', 'Shirt'],
    bottoms: ['Jeans', 'Pants'],
    footwear: ['Shoes'],
    outerwear: ['Jacket'] // optional
  },
  work: {
    tops: ['Shirt'],
    bottoms: ['Pants'],
    footwear: ['Shoes'],
    outerwear: ['Jacket'] // optional
  },
  formal: {
    tops: ['Shirt', 'Dress'],
    bottoms: ['Pants', 'Skirt'],
    footwear: ['Shoes'],
    outerwear: ['Jacket'] // recommended
  }
};

// Get outfit suggestions
exports.suggestOutfits = async (req, res) => {
  try {
    const { occasion, exclude_ids = [] } = req.body;
    
    if (!occasion || !outfitRules[occasion]) {
      return res.status(400).json({ error: 'Invalid occasion' });
    }
    
    const rules = outfitRules[occasion];
    const outfits = [];
    
    // Get user's clothing items
    const userClothes = await ClothingItem.find({ 
      user: req.userId,
      _id: { $nin: exclude_ids }
    });
    
    // Group clothes by category
    const clothesByCategory = {};
    userClothes.forEach(item => {
      if (!clothesByCategory[item.category]) {
        clothesByCategory[item.category] = [];
      }
      clothesByCategory[item.category].push(item);
    });
    
    // Generate 3 outfit suggestions
    for (let i = 0; i < 3; i++) {
      const outfit = {};
      
      // Select tops
      const topCategories = rules.tops.filter(cat => clothesByCategory[cat]?.length > 0);
      if (topCategories.length > 0) {
        const topCategory = topCategories[Math.floor(Math.random() * topCategories.length)];
        const tops = clothesByCategory[topCategory];
        outfit.top = tops[Math.floor(Math.random() * tops.length)];
      }
      
      // Select bottoms (skip if dress selected)
      if (!outfit.top || outfit.top.category !== 'Dress') {
        const bottomCategories = rules.bottoms.filter(cat => clothesByCategory[cat]?.length > 0);
        if (bottomCategories.length > 0) {
          const bottomCategory = bottomCategories[Math.floor(Math.random() * bottomCategories.length)];
          const bottoms = clothesByCategory[bottomCategory];
          outfit.bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
        }
      }
      
      // Select footwear
      const footwearCategories = rules.footwear.filter(cat => clothesByCategory[cat]?.length > 0);
      if (footwearCategories.length > 0) {
        const footwearCategory = footwearCategories[Math.floor(Math.random() * footwearCategories.length)];
        const footwear = clothesByCategory[footwearCategory];
        outfit.footwear = footwear[Math.floor(Math.random() * footwear.length)];
      }
      
      // Optionally add outerwear
      if (rules.outerwear && Math.random() > 0.5) {
        const outerwearCategories = rules.outerwear.filter(cat => clothesByCategory[cat]?.length > 0);
        if (outerwearCategories.length > 0) {
          const outerwearCategory = outerwearCategories[Math.floor(Math.random() * outerwearCategories.length)];
          const outerwear = clothesByCategory[outerwearCategory];
          outfit.outerwear = outerwear[Math.floor(Math.random() * outerwear.length)];
        }
      }
      
      // Only add outfit if it has at least top and footwear
      if (outfit.top && outfit.footwear) {
        outfits.push(outfit);
      }
    }
    
    res.json({ 
      outfits,
      occasion,
      total: outfits.length 
    });
  } catch (error) {
    console.error('Suggest outfits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get available occasions
exports.getOccasions = (req, res) => {
  res.json({
    occasions: Object.keys(outfitRules)
  });
};

// AI-powered outfit suggestions with natural language
exports.suggestOutfitsWithAI = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Get all user's clothing items with full details
    const userClothes = await ClothingItem.find({ user: req.userId });

    if (userClothes.length === 0) {
      return res.json({
        outfits: [],
        general_advice: 'Your wardrobe is empty. Start by adding some clothing items!',
        missing_items: ['basic t-shirts', 'jeans', 'comfortable shoes']
      });
    }

    // Get AI suggestions
    const suggestions = await outfitSuggestionService.suggestOutfits(query, userClothes);

    // Populate full item details for each outfit
    const populatedOutfits = await Promise.all(
      suggestions.outfits.map(async (outfit) => {
        const items = await ClothingItem.find({
          _id: { $in: outfit.items }
        }).select('name type category color brand image_url size').lean();

        // Add server prefix to image URLs
        const itemsWithFullUrls = items.map(item => ({
          ...item,
          image_url: item.image_url?.startsWith('/uploads')
            ? `${req.protocol}://${req.get('host')}${item.image_url}`
            : item.image_url
        }));

        return {
          ...outfit,
          itemDetails: itemsWithFullUrls
        };
      })
    );

    res.json({
      ...suggestions,
      outfits: populatedOutfits,
      query,
      totalItems: userClothes.length
    });

  } catch (error) {
    console.error('AI outfit suggestion error:', error);
    res.status(500).json({
      error: 'Failed to generate outfit suggestions',
      message: error.message
    });
  }
};