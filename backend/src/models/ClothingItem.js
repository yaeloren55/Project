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
    enum: ['Black', 'White', 'Gray', 'Beige', 'Brown', 'Cream', 'Ivory', 'Taupe',
           'Navy', 'Blue', 'Light Blue', 'Sky Blue', 'Teal', 'Turquoise',
           'Green', 'Olive', 'Khaki', 'Mint', 'Sage', 'Emerald',
           'Red', 'Burgundy', 'Maroon', 'Pink', 'Hot Pink', 'Blush',
           'Yellow', 'Mustard', 'Orange', 'Peach', 'Coral',
           'Purple', 'Lavender', 'Lilac', 'Violet',
           'Gold', 'Silver', 'Copper', 'Bronze']
  },
  brand: {
    type: String,
    trim: true
  },
  image: {
    type: String,  // Base64 encoded image
    required: true
  },
  image_url: {
    type: String,  // Kept for backward compatibility
    required: false
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
    enum: ['Casual', 'Work', 'Formal', 'Party', 'Sports', 'Date', 'Beach', 'Home']
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