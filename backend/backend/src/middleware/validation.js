const { body } = require('express-validator');

// Auth validations
exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Clothing item validations
exports.validateClothingItem = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Shoes', 'Accessories'])
    .withMessage('Invalid category'),
  body('color').isIn(['Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Beige'])
    .withMessage('Invalid color'),
  body('size').optional().trim(),
  body('brand').optional().trim(),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long'),
  
  // New field validations
  body('pattern').optional().isIn(['Solid', 'Striped', 'Checkered', 'Floral', 'Printed', 'Geometric', 'Abstract', 'None'])
    .withMessage('Invalid pattern'),
  body('material').optional().isIn(['Cotton', 'Denim', 'Leather', 'Wool', 'Polyester', 'Silk', 'Linen', 'Synthetic', 'Mixed', 'Unknown'])
    .withMessage('Invalid material'),
  body('style').optional().isIn(['Casual', 'Formal', 'Business', 'Sport', 'Streetwear', 'Vintage', 'Elegant', 'Bohemian'])
    .withMessage('Invalid style'),
  body('fit').optional().isIn(['Slim', 'Regular', 'Loose', 'Oversized', 'Fitted', 'Relaxed'])
    .withMessage('Invalid fit'),
  body('gender').optional().isIn(['Men', 'Women', 'Unisex', 'Boys', 'Girls'])
    .withMessage('Invalid gender'),
  
  // Array field validations - accept both arrays and JSON strings
  body('season').optional().custom(value => {
    let seasons = value;
    if (typeof value === 'string') {
      try {
        seasons = JSON.parse(value);
      } catch (e) {
        return false;
      }
    }
    if (!Array.isArray(seasons)) return false;
    const validSeasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All-Season'];
    return seasons.every(s => validSeasons.includes(s));
  }).withMessage('Invalid season values'),
  
  body('occasion').optional().custom(value => {
    let occasions = value;
    if (typeof value === 'string') {
      try {
        occasions = JSON.parse(value);
      } catch (e) {
        console.log('Failed to parse occasion JSON:', e);
        console.log('Raw value:', value);
        return false;
      }
    }
    if (!Array.isArray(occasions)) {
      console.log('Occasions is not an array:', occasions);
      return false;
    }
    const validOccasions = [
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
    ];

    // Debug logging
    console.log('Checking occasions:', occasions);
    console.log('Occasions types:', occasions.map(o => typeof o));
    console.log('Occasions with quotes:', occasions.map(o => `"${o}"`));

    const invalidOccasions = occasions.filter(o => {
      const trimmed = o.trim().toLowerCase();
      return !validOccasions.map(v => v.trim().toLowerCase()).includes(trimmed);
    });

    if (invalidOccasions.length > 0) {
      console.log('Invalid occasions found:', invalidOccasions);
      console.log('Valid occasions are:', validOccasions);
      return false;
    }

    // Use case-insensitive and trimmed comparison
    return occasions.every(o => {
      const trimmed = o.trim().toLowerCase();
      return validOccasions.map(v => v.trim().toLowerCase()).includes(trimmed);
    });
  }).withMessage('Invalid occasion values'),
  
  body('features').optional().custom(value => {
    let features = value;
    if (typeof value === 'string') {
      try {
        features = JSON.parse(value);
      } catch (e) {
        return false;
      }
    }
    return Array.isArray(features);
  }).withMessage('Features must be an array')
];

// Outfit suggestion validation
exports.validateOutfitSuggestion = [
  body('occasion').isIn(['casual', 'work', 'formal']).withMessage('Invalid occasion'),
  body('exclude_ids').optional().isArray().withMessage('Exclude IDs must be an array')
];