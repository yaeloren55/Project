const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const auth = require('../middleware/auth');
const { validateClothingItem } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Get all clothes
router.get('/', clothingController.getClothes);

// Get single item
router.get('/:id', clothingController.getClothingItem);

// Add new item (base64 image in JSON body)
router.post('/',
  validateClothingItem,
  clothingController.addClothingItem
);

// Update item (base64 image in JSON body)
router.put('/:id',
  validateClothingItem,
  clothingController.updateClothingItem
);

// Delete item
router.delete('/:id', clothingController.deleteClothingItem);

module.exports = router;