// JSON Schema for OpenAI Clothing Analysis Response
const clothingAnalysisSchema = {
  // Required fields that match our existing database schema
  name: {
    type: 'string',
    description: 'A descriptive name for the clothing item (e.g., "Blue Denim Skinny Jeans", "White Cotton T-Shirt")',
    required: true
  },
  
  category: {
    type: 'string',
    enum: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Shoes', 'Accessories'],
    description: 'Main category of the clothing item',
    required: true
  },
  
  color: {
    type: 'string',
    enum: ['Black', 'White', 'Gray', 'Beige', 'Brown', 'Cream', 'Ivory', 'Taupe',
           'Navy', 'Blue', 'Light Blue', 'Sky Blue', 'Teal', 'Turquoise',
           'Green', 'Olive', 'Khaki', 'Mint', 'Sage', 'Emerald',
           'Red', 'Burgundy', 'Maroon', 'Pink', 'Hot Pink', 'Blush',
           'Yellow', 'Mustard', 'Orange', 'Peach', 'Coral',
           'Purple', 'Lavender', 'Lilac', 'Violet',
           'Gold', 'Silver', 'Copper', 'Bronze'],
    description: 'Primary/dominant color of the item',
    required: true
  },
  
  // Optional fields for better categorization
  secondary_colors: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['Black', 'White', 'Gray', 'Beige', 'Brown', 'Cream', 'Ivory', 'Taupe',
             'Navy', 'Blue', 'Light Blue', 'Sky Blue', 'Teal', 'Turquoise',
             'Green', 'Olive', 'Khaki', 'Mint', 'Sage', 'Emerald',
             'Red', 'Burgundy', 'Maroon', 'Pink', 'Hot Pink', 'Blush',
             'Yellow', 'Mustard', 'Orange', 'Peach', 'Coral',
             'Purple', 'Lavender', 'Lilac', 'Violet',
             'Gold', 'Silver', 'Copper', 'Bronze']
    },
    description: 'Additional colors present in the item',
    required: false
  },
  
  pattern: {
    type: 'string',
    enum: ['Solid', 'Striped', 'Checkered', 'Floral', 'Printed', 'Geometric', 'Abstract', 'None'],
    description: 'Pattern or print on the clothing',
    required: false
  },
  
  material: {
    type: 'string',
    enum: ['Cotton', 'Denim', 'Leather', 'Wool', 'Polyester', 'Silk', 'Linen', 'Synthetic', 'Mixed', 'Unknown'],
    description: 'Primary material/fabric of the item',
    required: false
  },
  
  style: {
    type: 'string',
    enum: ['Casual', 'Formal', 'Business', 'Sport', 'Streetwear', 'Vintage', 'Elegant', 'Bohemian'],
    description: 'Overall style category',
    required: false
  },
  
  fit: {
    type: 'string',
    enum: ['Slim', 'Regular', 'Loose', 'Oversized', 'Fitted', 'Relaxed'],
    description: 'Fit type of the clothing',
    required: false
  },
  
  season: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All-Season']
    },
    description: 'Suitable seasons for wearing',
    required: false
  },
  
  occasion: {
    type: 'array',
    items: {
      type: 'string',
      enum: ['Casual', 'Work', 'Formal', 'Party', 'Sports', 'Date', 'Beach', 'Home']
    },
    description: 'Suitable occasions for the item',
    required: false
  },
  
  gender: {
    type: 'string',
    enum: ['Men', 'Women', 'Unisex', 'Boys', 'Girls'],
    description: 'Target gender for the clothing',
    required: false
  },
  
  brand: {
    type: 'string',
    description: 'Brand name if visible in the image',
    required: false
  },
  
  features: {
    type: 'array',
    items: {
      type: 'string'
    },
    description: 'Notable features (e.g., "ripped", "distressed", "embroidered", "pockets", "buttons", "zipper")',
    required: false
  },
  
  
  confidence_score: {
    type: 'number',
    min: 0,
    max: 1,
    description: 'Confidence level of the analysis (0-1)',
    required: false
  },
  
  notes: {
    type: 'string',
    description: 'Additional descriptive notes about the item',
    required: false
  }
};

// Example prompt for OpenAI Vision API
const analysisPrompt = `Analyze this clothing item image and return a JSON object with the following information:

Required fields:
- name: A descriptive name for the item
- category: Must be one of [T-Shirt, Shirt, Pants, Jeans, Dress, Skirt, Jacket, Shoes, Accessories]
- color: Primary color, must be one of [Black, White, Gray, Beige, Brown, Cream, Ivory, Taupe, Navy, Blue, Light Blue, Sky Blue, Teal, Turquoise, Green, Olive, Khaki, Mint, Sage, Emerald, Red, Burgundy, Maroon, Pink, Hot Pink, Blush, Yellow, Mustard, Orange, Peach, Coral, Purple, Lavender, Lilac, Violet, Gold, Silver, Copper, Bronze]

Optional fields (include if clearly visible/determinable):
- secondary_colors: Array of additional colors
- pattern: Type of pattern (Solid, Striped, Checkered, Floral, Printed, Geometric, Abstract, None)
- material: Fabric type if identifiable
- style: Overall style (Casual, Formal, Business, Sport, etc.)
- fit: Fit type (Slim, Regular, Loose, etc.)
- season: Suitable seasons array
- occasion: Suitable occasions array
- gender: Target gender
- brand: Brand name if visible
- features: Notable features array (e.g., "ripped", "pockets", "buttons")
- confidence_score: Your confidence in the analysis (0-1)
- notes: Any additional relevant details

Return ONLY valid JSON, no additional text.`;

module.exports = {
  clothingAnalysisSchema,
  analysisPrompt
};