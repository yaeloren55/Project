const { GoogleGenAI } = require('@google/genai');
const fs = require('fs').promises;
const path = require('path');

class TryOnService {
  constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.GEMINI_API_KEY || process.env.gemini_api_key;
    if (!this.apiKey) {
      console.error('Warning: GEMINI_API_KEY not found in environment variables');
    }

    this.model = 'gemini-2.5-flash-image-preview';

    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.gif') return 'image/gif';
    return 'image/jpeg'; // default
  }

  async fileToInlineData(filePath) {
    try {
      const data = await fs.readFile(filePath);
      return {
        inlineData: {
          mimeType: this.getMimeType(filePath),
          data: data.toString('base64')
        }
      };
    } catch (error) {
      console.error('Error reading file:', filePath, error);
      throw error;
    }
  }

  base64ToInlineData(base64String, mimeType = 'image/jpeg') {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return {
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    };
  }

  async generateTryOn(userImage, clothingImages, prompt = '') {
    if (!this.ai) {
      throw new Error('Gemini API not configured. Please check your API key.');
    }

    try {
      // Prepare the images array - user image first, then clothing items
      const parts = [];

      // Add user image
      if (userImage.startsWith('data:')) {
        // Base64 image
        parts.push(this.base64ToInlineData(userImage));
      } else {
        // File path
        parts.push(await this.fileToInlineData(userImage));
      }

      // Add clothing images
      for (const clothingImage of clothingImages) {
        if (clothingImage.startsWith('data:')) {
          // Base64 image
          parts.push(this.base64ToInlineData(clothingImage));
        } else if (clothingImage.startsWith('/uploads/')) {
          // Local file path
          const fullPath = path.join(process.cwd(), clothingImage);
          parts.push(await this.fileToInlineData(fullPath));
        } else if (clothingImage.startsWith('uploads/')) {
          // Local file path without leading slash
          const fullPath = path.join(process.cwd(), clothingImage);
          parts.push(await this.fileToInlineData(fullPath));
        } else {
          // Assume it's a full path
          parts.push(await this.fileToInlineData(clothingImage));
        }
      }

      // Build the prompt
      const defaultPrompt = 'Edit the first image to dress the person with clothes from the other images. Keep the person\'s face, body shape, and background unchanged. Only change the clothes to match the items shown in the other images, ensuring they fit naturally and realistically on the person.';
      const finalPrompt = prompt ? `${defaultPrompt} Additional instructions: ${prompt}` : defaultPrompt;

      // Generate content (following test.mjs pattern)
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [{ text: finalPrompt }, ...parts],
      });

      // Extract the generated image
      const generatedImage = response.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);

      if (!generatedImage) {
        throw new Error('No image was generated');
      }

      // Convert to base64 data URL
      const mimeType = generatedImage.inlineData.mimeType || 'image/png';
      const base64Data = generatedImage.inlineData.data;
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return {
        success: true,
        image: dataUrl
      };

    } catch (error) {
      console.error('Try-on generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate try-on image'
      };
    }
  }
}

module.exports = new TryOnService();