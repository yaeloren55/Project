const ClothingItem = require('../models/ClothingItem');
const { validationResult } = require('express-validator');

// Get all clothing items for user
exports.getClothes = async (req, res) => {
  try {
    const { category, color, search, season, occasion } = req.query;
    console.log('Query params:', { category, color, search, season, occasion });
    
    // Build query
    const query = { user: req.userId };
    
    if (category) {
      query.category = category;
    }
    
    if (color) {
      query.color = color;
    }
    
    if (season) {
      query.season = { $in: [season] };
    }
    
    if (occasion) {
      query.occasion = { $in: [occasion] };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('Final query:', JSON.stringify(query, null, 2));
    const clothes = await ClothingItem.find(query).sort('-createdAt').lean();
    console.log('Found items:', clothes.length);

    // Add server prefix to image URLs
    const clothesWithFullUrls = clothes.map(item => ({
      ...item,
      image_url: item.image_url?.startsWith('/uploads')
        ? `${req.protocol}://${req.get('host')}${item.image_url}`
        : item.image_url
    }));

    res.json({
      items: clothesWithFullUrls,
      total: clothesWithFullUrls.length
    });
  } catch (error) {
    console.error('Get clothes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single clothing item
exports.getClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.userId
    }).lean();

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Add server prefix to image URL
    if (item.image_url?.startsWith('/uploads')) {
      item.image_url = `${req.protocol}://${req.get('host')}${item.image_url}`;
    }

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add new clothing item
exports.addClothingItem = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      name, category, color, size, brand, notes,
      pattern, material, style, fit, season, 
      occasion, gender, features 
    } = req.body;
    
    // For now, use a placeholder image URL
    // In production, you'd handle actual file upload here
    const image_url = req.file 
      ? `/uploads/${req.file.filename}` 
      : 'https://via.placeholder.com/300x400';
    
    // Parse JSON strings for arrays if they come from FormData
    let parsedSeason = season;
    let parsedOccasion = occasion;
    let parsedFeatures = features;
    
    if (typeof season === 'string') {
      try {
        parsedSeason = season ? JSON.parse(season) : [];
      } catch (e) {
        parsedSeason = [];
      }
    }
    
    if (typeof occasion === 'string') {
      try {
        parsedOccasion = occasion ? JSON.parse(occasion) : [];
      } catch (e) {
        parsedOccasion = [];
      }
    }
    
    if (typeof features === 'string') {
      try {
        parsedFeatures = features ? JSON.parse(features) : [];
      } catch (e) {
        parsedFeatures = [];
      }
    }
    
    console.log('Parsed arrays:', {
      season: parsedSeason,
      occasion: parsedOccasion,
      features: parsedFeatures
    });
    
    const itemData = {
      user: req.userId,
      name,
      category,
      color,
      size,
      brand,
      notes,
      image_url,
      pattern: pattern || undefined,
      material: material || undefined,
      style: style || undefined,
      fit: fit || undefined,
      season: parsedSeason || [],
      occasion: parsedOccasion || [],
      gender: gender || undefined,
      features: parsedFeatures || []
    };
    
    console.log('Creating item with data:', itemData);
    
    const item = new ClothingItem(itemData);
    
    await item.save();

    // Convert to plain object and add server prefix to image URL
    const itemObject = item.toObject();
    if (itemObject.image_url?.startsWith('/uploads')) {
      itemObject.image_url = `${req.protocol}://${req.get('host')}${itemObject.image_url}`;
    }

    console.log('Saved item:', itemObject);

    res.status(201).json({
      message: 'Item added successfully',
      item: itemObject
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update clothing item
exports.updateClothingItem = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const item = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update image if provided
    if (req.file) {
      item.image_url = `/uploads/${req.file.filename}`;
    }
    
    // Update fields
    const updates = ['name', 'category', 'color', 'size', 'brand', 'notes',
                    'pattern', 'material', 'style', 'fit', 'gender'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });
    
    // Handle array fields specially
    const arrayFields = ['season', 'occasion', 'features'];
    arrayFields.forEach(field => {
      if (req.body[field] !== undefined) {
        let value = req.body[field];
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = [];
          }
        }
        item[field] = value;
      }
    });
    
    console.log('Updating item with data:', item.toObject());

    await item.save();

    // Convert to plain object and add server prefix to image URL
    const itemObject = item.toObject();
    if (itemObject.image_url?.startsWith('/uploads')) {
      itemObject.image_url = `${req.protocol}://${req.get('host')}${itemObject.image_url}`;
    }

    res.json({
      message: 'Item updated successfully',
      item: itemObject
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete clothing item
exports.deleteClothingItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};