const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const { validateClothingItem } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Get all clothes
router.get('/', clothingController.getClothes);

// Get single item
router.get('/:id', clothingController.getClothingItem);

// Add new item (with image upload)
router.post('/', 
  upload.single('image'), 
  validateClothingItem, 
  clothingController.addClothingItem
);

// Update item (with image upload)
router.put('/:id', 
  upload.single('image'), 
  validateClothingItem, 
  clothingController.updateClothingItem
);

// Delete item
router.delete('/:id', clothingController.deleteClothingItem);

module.exports = router;