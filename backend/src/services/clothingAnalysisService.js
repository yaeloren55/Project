const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ClothingAnalysisService {
  /**
   * Analyzes a clothing image using OpenAI Vision API
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeClothingImage(base64Image) {
    try {
      // Check if API key is configured
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.log('OpenAI API key not configured, returning mock data');
        console.log('Current API key:', process.env.OPENAI_API_KEY ? 'Set (hidden)' : 'Not set');
        return this.getMockAnalysis();
      }
      
      console.log('Attempting OpenAI API call with gpt-5-mini model...');

      // Ensure base64 image has the correct format
      let imageData = base64Image;
      if (!imageData.startsWith('data:image')) {
        imageData = `data:image/jpeg;base64,${base64Image}`;
      }

      // Call OpenAI Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `Analyze this clothing item image and return a JSON object with the following information:

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
- occasion: Suitable occasions from [Casual, Work, Formal, Party, Sports, Date, Beach, Home]
- gender: Target gender
- brand: Brand name if visible
- features: Notable features array (e.g., "ripped", "pockets", "buttons")
- notes: Any additional relevant details

Return ONLY valid JSON matching the schema.`
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "clothing_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "A descriptive name for the clothing item"
                },
                category: {
                  type: "string",
                  enum: ["T-Shirt", "Shirt", "Pants", "Jeans", "Dress", "Skirt", "Jacket", "Shoes", "Accessories"],
                  description: "Main category of the clothing item"
                },
                color: {
                  type: "string",
                  enum: ["Black", "White", "Gray", "Beige", "Brown", "Cream", "Ivory", "Taupe",
                         "Navy", "Blue", "Light Blue", "Sky Blue", "Teal", "Turquoise",
                         "Green", "Olive", "Khaki", "Mint", "Sage", "Emerald",
                         "Red", "Burgundy", "Maroon", "Pink", "Hot Pink", "Blush",
                         "Yellow", "Mustard", "Orange", "Peach", "Coral",
                         "Purple", "Lavender", "Lilac", "Violet",
                         "Gold", "Silver", "Copper", "Bronze"],
                  description: "Primary color of the item"
                },
                secondary_colors: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["Black", "White", "Gray", "Beige", "Brown", "Cream", "Ivory", "Taupe",
                           "Navy", "Blue", "Light Blue", "Sky Blue", "Teal", "Turquoise",
                           "Green", "Olive", "Khaki", "Mint", "Sage", "Emerald",
                           "Red", "Burgundy", "Maroon", "Pink", "Hot Pink", "Blush",
                           "Yellow", "Mustard", "Orange", "Peach", "Coral",
                           "Purple", "Lavender", "Lilac", "Violet",
                           "Gold", "Silver", "Copper", "Bronze"]
                  },
                  description: "Additional colors present"
                },
                pattern: {
                  type: "string",
                  enum: ["Solid", "Striped", "Checkered", "Floral", "Printed", "Geometric", "Abstract", "None"],
                  description: "Pattern on the clothing"
                },
                material: {
                  type: "string",
                  enum: ["Cotton", "Denim", "Leather", "Wool", "Polyester", "Silk", "Linen", "Synthetic", "Mixed", "Unknown"],
                  description: "Primary material"
                },
                style: {
                  type: "string",
                  enum: ["Casual", "Formal", "Business", "Sport", "Streetwear", "Vintage", "Elegant", "Bohemian"],
                  description: "Overall style"
                },
                fit: {
                  type: "string",
                  enum: ["Slim", "Regular", "Loose", "Oversized", "Fitted", "Relaxed"],
                  description: "Fit type"
                },
                season: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["Spring", "Summer", "Fall", "Winter", "All-Season"]
                  },
                  description: "Suitable seasons"
                },
                occasion: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["Casual", "Work", "Formal", "Party", "Sports", "Date", "Beach", "Home"]
                  },
                  description: "Suitable occasions for this item"
                },
                gender: {
                  type: "string",
                  enum: ["Men", "Women", "Unisex", "Boys", "Girls"],
                  description: "Target gender"
                },
                brand: {
                  type: "string",
                  description: "Brand name if visible"
                },
                features: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "Notable features"
                },
                confidence_score: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                  description: "Confidence level (0-1)"
                },
                notes: {
                  type: "string",
                  description: "Additional notes"
                }
              },
              required: [
                "name", "category", "color", "secondary_colors", "pattern",
                "material", "style", "fit", "season", "occasion",
                "gender", "brand", "features", "confidence_score", "notes"
              ],
              additionalProperties: false
            }
          }
        }
      });

      console.log('OpenAI API response received');
      console.log('Response structure:', JSON.stringify({
        hasChoices: !!response?.choices,
        choicesLength: response?.choices?.length,
        firstChoice: response?.choices?.[0] ? 'exists' : 'missing'
      }));

      // Extract the analysis from the response
      if (response && response.choices && response.choices.length > 0) {
        const analysisText = response.choices[0].message.content;
          
        try {
          const analysis = JSON.parse(analysisText);
          return {
            success: true,
            data: analysis
          };
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', parseError);
          console.error('Response text:', analysisText);
          return {
            success: false,
            error: 'Failed to parse analysis',
            data: this.getMockAnalysis().data
          };
        }
      }
      
      // If we can't find the response in the expected format, return mock data
      return {
        success: false,
        error: 'Unexpected response format',
        data: this.getMockAnalysis().data
      };
      
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return mock data on error
      return {
        success: false,
        error: error.message,
        data: this.getMockAnalysis().data
      };
    }
  }

  /**
   * Returns mock analysis data for testing or when API is unavailable
   */
  getMockAnalysis() {
    return {
      success: true,
      data: {
        name: 'Analyzed Clothing Item',
        category: 'T-Shirt',
        color: 'Blue',
        secondary_colors: [],
        pattern: 'Solid',
        material: 'Cotton',
        style: 'Casual',
        fit: 'Regular',
        season: ['Spring', 'Summer', 'Fall'],
        occasion: ['Casual', 'Home'],
        gender: 'Unisex',
        brand: '',
        features: ['short sleeves', 'crew neck'],
        confidence_score: 0.85,
        notes: 'AI analysis not available - using default values'
      }
    };
  }

  /**
   * Process image file to base64
   */
  imageToBase64(buffer) {
    return buffer.toString('base64');
  }
}

module.exports = new ClothingAnalysisService();