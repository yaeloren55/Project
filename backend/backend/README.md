# Digital Wardrobe - Backend

A Node.js REST API server for the Digital Wardrobe application, featuring AI-powered clothing analysis, outfit suggestions, and virtual try-on capabilities.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Secure password hashing with bcrypt
- Protected routes with middleware
- User session management

### 📦 Wardrobe Management API
- Full CRUD operations for clothing items
- Advanced filtering and search capabilities
- Image upload and storage
- MongoDB database integration

### 🤖 AI Integration
- **OpenAI GPT Integration** for:
  - Automated clothing analysis from images
  - Natural language outfit suggestions
  - Style recommendations
- **Google Gemini AI** for:
  - Virtual try-on image generation
  - Realistic clothing visualization

### 🖼️ Image Processing
- Base64 image handling for AI analysis
- File upload with Multer
- Static file serving
- Image validation and size limits

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **OpenAI API** - Clothing analysis & outfit suggestions
- **Google Gemini API** - Virtual try-on generation
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

## Prerequisites

- Node.js 16+ and npm
- MongoDB 5+ (local or Atlas)
- OpenAI API key
- Google Gemini API key

## Installation

1. Clone the repository and navigate to backend:
```bash
cd lockerProejct/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in backend directory
PORT=3000
MONGODB_URI=mongodb://localhost:27017/digital_wardrobe
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
gemini_api_key=your_gemini_api_key_here
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── multer.js        # File upload configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── clothingController.js   # Wardrobe CRUD operations
│   │   ├── outfitController.js     # Outfit suggestions
│   │   ├── analysisController.js   # AI clothing analysis
│   │   └── tryOnController.js      # Virtual try-on
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── validation.js    # Request validation
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── ClothingItem.js  # Clothing schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── clothingRoutes.js # Wardrobe endpoints
│   │   ├── outfitRoutes.js  # Outfit endpoints
│   │   ├── analysisRoutes.js # Analysis endpoints
│   │   └── tryOn.js         # Try-on endpoints
│   ├── services/
│   │   ├── clothingAnalysisService.js # OpenAI integration
│   │   ├── outfitSuggestionService.js # Outfit AI logic
│   │   └── tryOnService.js           # Gemini integration
│   └── server.js            # Express app setup
├── uploads/                 # Uploaded images
├── test.mjs                # Gemini test script
├── .env                    # Environment variables
├── .gitignore
└── package.json
```

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Create new user account
POST   /api/auth/login        - Login user
GET    /api/auth/verify       - Verify JWT token
```

### Wardrobe Management
```
GET    /api/clothes           - Get all clothes (with filters)
GET    /api/clothes/:id       - Get single clothing item
POST   /api/clothes           - Add new clothing item
PUT    /api/clothes/:id       - Update clothing item
DELETE /api/clothes/:id       - Delete clothing item
```

Query parameters for GET /api/clothes:
- `category` - Filter by category
- `color` - Filter by color
- `season` - Filter by season
- `occasion` - Filter by occasion
- `search` - Search in name/notes

### AI Analysis
```
POST   /api/analysis/analyze  - Analyze clothing from image
```

Request body:
```json
{
  "image": "base64_encoded_image_string"
}
```

### Outfit Suggestions
```
POST   /api/outfits/suggest   - Classic occasion-based suggestions
POST   /api/outfits/ai-suggest - AI natural language suggestions
```

### Virtual Try-On
```
POST   /api/try-on/generate   - Generate virtual try-on image
```

Request body:
```json
{
  "userImage": "base64_encoded_image",
  "clothingIds": ["item_id_1", "item_id_2"],
  "prompt": "Optional styling instructions"
}
```

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### ClothingItem Schema
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  category: String (enum),
  color: String (enum),
  size: String,
  brand: String,
  image_url: String,
  notes: String,
  pattern: String (enum),
  material: String (enum),
  style: String (enum),
  fit: String (enum),
  season: [String],
  occasion: [String],
  gender: String (enum),
  features: [String],
  timestamps: true
}
```

## Available Scripts

```bash
# Development with nodemon
npm run dev

# Production
npm start

# Testing (if configured)
npm test
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `OPENAI_API_KEY` | OpenAI API key for GPT | Yes |
| `gemini_api_key` | Google Gemini API key | Yes |

## AI Services Configuration

### OpenAI GPT Configuration
Located in `clothingAnalysisService.js`:
- Model: `gpt-5-mini`
- Used for clothing analysis and outfit suggestions
- Structured JSON responses with detailed metadata

### Google Gemini Configuration
Located in `tryOnService.js`:
- Model: `gemini-2.5-flash-image-preview`
- Used for virtual try-on image generation
- Processes multiple images (user + clothing items)

## Middleware

### Authentication (`auth.js`)
- Verifies JWT tokens
- Extracts user ID from token
- Protects private routes

### Validation (`validation.js`)
- Input validation using express-validator
- Validates registration, login, and clothing data
- Custom validators for arrays and enums

## File Upload Configuration

Using Multer (`multer.js`):
- **Allowed formats**: JPEG, JPG, PNG, GIF
- **Max file size**: 5MB
- **Storage**: Local disk in `uploads/` directory
- **Filename**: Unique timestamp-based naming

## Error Handling

The API uses consistent error response format:
```json
{
  "error": "Error message",
  "details": "Additional information (if available)"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Tokens expire after 7 days
   - Secure token verification

3. **Input Validation**
   - All inputs validated and sanitized
   - File type and size restrictions

4. **CORS Configuration**
   - Configured for frontend access
   - Customizable origin settings

5. **Rate Limiting** (recommended to add)
   - Prevent API abuse
   - Protect AI endpoints

## Database Indexes

Optimized queries with indexes on:
- `user + category + color`
- `user + style`
- `user + season`
- `user + occasion`

## Development Tips

1. **Database Setup**
   - Use MongoDB Compass for GUI management
   - Consider MongoDB Atlas for cloud deployment

2. **API Testing**
   - Use Postman or Insomnia for endpoint testing
   - Check `uploads/` directory permissions

3. **Debugging**
   - Console logs included for key operations
   - Check MongoDB connection on startup

4. **AI Services**
   - Monitor API usage and costs
   - Implement caching for repeated requests
   - Handle API rate limits gracefully

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Secure API keys

2. **Database**
   - Use MongoDB Atlas or managed service
   - Enable authentication
   - Regular backups

3. **File Storage**
   - Consider cloud storage (S3, Cloudinary)
   - Implement CDN for images

4. **Security**
   - Enable HTTPS
   - Add rate limiting
   - Implement request logging

5. **Process Management**
   - Use PM2 or similar
   - Enable clustering for scaling
   - Monitor memory usage

## Common Issues & Solutions

### MongoDB Connection Failed
- Check MongoDB service is running
- Verify connection string
- Check network/firewall settings

### File Upload Errors
- Ensure `uploads/` directory exists
- Check write permissions
- Verify file size limits

### AI API Errors
- Verify API keys are valid
- Check API quota/billing
- Handle rate limiting

### CORS Issues
- Configure allowed origins
- Check request headers
- Verify credentials setting

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepassword"}'
```

### Add Clothing Item
```bash
curl -X POST http://localhost:3000/api/clothes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "name=Blue Shirt" \
  -F "category=Shirt" \
  -F "color=Blue"
```

### Get AI Outfit Suggestion
```bash
curl -X POST http://localhost:3000/api/outfits/ai-suggest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"What should I wear for a job interview?"}'
```

## Contributing

1. Follow Node.js best practices
2. Use async/await for asynchronous operations
3. Implement proper error handling
4. Add input validation for new endpoints
5. Update documentation for API changes
6. Test all endpoints before committing

## License

Private project - All rights reserved