const OpenAI = require('openai');

class OutfitSuggestionService {
  constructor() {
    console.log('Initializing OutfitSuggestionService...');
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('OpenAI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
    }
  }

  // Convert clothing items to descriptive text for AI context
  formatWardrobeForAI(clothingItems) {
    return clothingItems.map((item, index) => {
      const occasions = item.occasions?.length > 0 ? item.occasions.join(', ') : 'general wear';
      const category = item.category || item.type || 'unknown';
      return `Item ${index + 1} (ID: ${item._id}): [CATEGORY: ${category}] ${item.color} ${item.name || category} by ${item.brand || 'unknown brand'}, size ${item.size}, made of ${item.material || 'unknown material'}, ${item.pattern || 'solid'} pattern, suitable for: ${occasions}. Tags: ${item.tags?.join(', ') || 'none'}`;
    }).join('\n');
  }

  async suggestOutfits(query, clothingItems) {
    try {
      const wardrobeDescription = this.formatWardrobeForAI(clothingItems);

      console.log('Making OpenAI API request...');
      console.log('Number of clothing items:', clothingItems.length);
      console.log('User query:', query);

      const systemPrompt = `You are an expert fashion stylist helping users create outfits from their existing wardrobe.
You have access to the user's complete wardrobe inventory and will suggest outfit combinations based on their query.
Consider factors like color coordination, style matching, appropriateness for the occasion, and seasonal considerations.

IMPORTANT OUTFIT RULES:
1. Each outfit MUST be a complete, wearable combination
2. Never suggest two items of the same category (e.g., two pants, two shirts)
3. Valid outfit combinations include:
   - Top (shirt/t-shirt/blouse) + Bottom (pants/jeans/skirt/shorts)
   - Dress (can be worn alone as a complete outfit)
   - Top + Bottom + Outerwear (jacket/blazer/coat)
   - Any above + Shoes + Accessories
4. NEVER create outfits with only bottoms or only tops
5. NEVER suggest outfit that doesnt match the user query requirements
6 Always use the actual item IDs provided in the wardrobe list when suggesting outfits.`;

      const userPrompt = `User Query: "${query}"

Available Wardrobe Items:
${wardrobeDescription}

Based on the user's query and their available wardrobe, suggest 1-3 VALID, COMPLETE outfit combinations. Each outfit must be wearable on its own (not just two pants or two shirts). Return a JSON object with this exact structure:

{
  "outfits": [
    {
      "name": "Outfit name",
      "items": ["item_id_1", "item_id_2"]
    }
  ],
  "general_advice": "Overall styling advice",
  "missing_items": ["items to consider adding"]
}

IMPORTANT: Use actual item IDs from the wardrobe list above. Return ONLY valid JSON.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }          
        ],
        response_format: { type: "json_object" },
        max_completion_tokens:4000,
      });

      console.log('OpenAI response received');
      console.log('Response structure:', JSON.stringify(response, null, 2));

      // Check if response has expected structure
      if (!response || !response.choices || !response.choices[0]) {
        console.error('Invalid response structure');
        console.error('Full response:', JSON.stringify(response, null, 2));
        throw new Error('Invalid OpenAI response structure');
      }

      const message = response.choices[0].message;
      if (!message || !message.content) {
        console.error('No content in response message');
        console.error('Message structure:', JSON.stringify(message, null, 2));
        throw new Error('No content in OpenAI response');
      }

      const content = message.content;
      console.log('Content to parse:', content);

      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      console.log('Parsed content successfully');
      console.log('Parsed outfits:', parsedContent.outfits?.length || 0);

      // Validate that suggested items actually exist in the user's wardrobe
      const validItemIds = new Set(clothingItems.map(item => item._id.toString()));

      parsedContent.outfits = parsedContent.outfits.filter(outfit => {
        const validItems = outfit.items.filter(itemId => validItemIds.has(itemId));
        outfit.items = validItems;
        return validItems.length > 0;
      });

      return parsedContent;

    } catch (error) {
      console.error('Error suggesting outfits:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Log additional context
      console.log('Falling back to rule-based suggestions');
      console.log('Query was:', query);
      console.log('Number of clothing items:', clothingItems.length);

      // Fallback to rule-based suggestions if AI fails
      return this.getFallbackSuggestions(query, clothingItems);
    }
  }

  // Fallback rule-based suggestion system
  getFallbackSuggestions(query, clothingItems) {
    const queryLower = query.toLowerCase();
    const suggestions = [];

    // Categorize items
    const tops = clothingItems.filter(item =>
      ['shirt', 'blouse', 't-shirt', 'top', 'sweater'].includes(item.type?.toLowerCase())
    );
    const bottoms = clothingItems.filter(item =>
      ['pants', 'jeans', 'skirt', 'shorts', 'trousers'].includes(item.type?.toLowerCase())
    );
    const dresses = clothingItems.filter(item =>
      ['dress', 'jumpsuit'].includes(item.type?.toLowerCase())
    );
    const outerwear = clothingItems.filter(item =>
      ['jacket', 'coat', 'blazer', 'cardigan'].includes(item.type?.toLowerCase())
    );
    const shoes = clothingItems.filter(item =>
      ['shoes', 'sneakers', 'heels', 'boots', 'flats'].includes(item.type?.toLowerCase())
    );

    // Detect occasion from query
    let occasionType = 'casual';
    if (queryLower.includes('formal') || queryLower.includes('business') || queryLower.includes('interview')) {
      occasionType = 'formal';
    } else if (queryLower.includes('party') || queryLower.includes('date') || queryLower.includes('dinner')) {
      occasionType = 'semi-formal';
    } else if (queryLower.includes('gym') || queryLower.includes('workout') || queryLower.includes('exercise')) {
      occasionType = 'athletic';
    }

    // Build outfit based on occasion
    if (occasionType === 'formal' && tops.length > 0 && bottoms.length > 0) {
      const formalTops = tops.filter(t =>
        t.occasions?.some(o => ['formal', 'business', 'work'].includes(o.toLowerCase()))
      );
      const formalBottoms = bottoms.filter(b =>
        b.occasions?.some(o => ['formal', 'business', 'work'].includes(o.toLowerCase()))
      );

      if (formalTops.length > 0 && formalBottoms.length > 0) {
        suggestions.push({
          name: "Professional Look",
          items: [formalTops[0]._id.toString(), formalBottoms[0]._id.toString()]
        });
      }
    }

    // Add a dress option if available
    if (dresses.length > 0) {
      const appropriateDress = dresses.find(d =>
        d.occasions?.some(o => o.toLowerCase().includes(occasionType))
      ) || dresses[0];

      suggestions.push({
        name: "Dress Option",
        items: [appropriateDress._id.toString()]
      });
    }

    // Default casual outfit
    if (suggestions.length === 0 && tops.length > 0 && bottoms.length > 0) {
      suggestions.push({
        name: "Casual Combination",
        items: [tops[0]._id.toString(), bottoms[0]._id.toString()]
      });
    }

    return {
      outfits: suggestions,
      general_advice: "Consider the weather and comfort level when choosing your outfit",
      missing_items: this.identifyMissingItems(clothingItems, occasionType)
    };
  }

  identifyMissingItems(clothingItems, occasionType) {
    const missing = [];
    const types = clothingItems.map(item => item.type?.toLowerCase());

    if (occasionType === 'formal') {
      if (!types.includes('blazer')) missing.push('blazer');
      if (!types.includes('dress shirt')) missing.push('dress shirt');
    }

    if (!types.includes('jeans')) missing.push('casual jeans');
    if (!types.includes('sneakers')) missing.push('comfortable sneakers');

    return missing;
  }
}

module.exports = new OutfitSuggestionService();