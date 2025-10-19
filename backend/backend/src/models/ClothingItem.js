const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Shoes', 'Accessories']
  },
  color: {
    type: String,
    required: true,
    enum: ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Beige']
  },
  size: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  // New fields from the JSON schema
  pattern: {
    type: String,
    enum: ['Solid', 'Striped', 'Checkered', 'Floral', 'Printed', 'Geometric', 'Abstract', 'None'],
    default: 'None'
  },
  material: {
    type: String,
    enum: ['Cotton', 'Denim', 'Leather', 'Wool', 'Polyester', 'Silk', 'Linen', 'Synthetic', 'Mixed', 'Unknown']
  },
  style: {
    type: String,
    enum: ['Casual', 'Formal', 'Business', 'Sport', 'Streetwear', 'Vintage', 'Elegant', 'Bohemian']
  },
  fit: {
    type: String,
    enum: ['Slim', 'Regular', 'Loose', 'Oversized', 'Fitted', 'Relaxed']
  },
  season: [{
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All-Season']
  }],
  occasion: [{
    type: String,
    enum: [
      'casual daily wear',
      'work office',
      'business meeting',
      'job interview',
      'date night',
      'party',
      'wedding guest',
      'cocktail party',
      'beach vacation',
      'gym workout',
      'outdoor activities',
      'brunch',
      'clubbing',
      'formal event',
      'conference',
      'weekend casual',
      'travel',
      'home lounging'
    ]
  }],
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Boys', 'Girls']
  },
  features: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster queries
clothingItemSchema.index({ user: 1, category: 1, color: 1 });
clothingItemSchema.index({ user: 1, style: 1 });
clothingItemSchema.index({ user: 1, season: 1 });
clothingItemSchema.index({ user: 1, occasion: 1 });

module.exports = mongoose.model('ClothingItem', clothingItemSchema);