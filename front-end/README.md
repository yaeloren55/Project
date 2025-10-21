# Digital Wardrobe - Frontend

A modern web application for managing your personal wardrobe digitally, getting AI-powered outfit suggestions, and virtually trying on clothes.

## Features

### 🗂️ Wardrobe Management
- Upload and organize your clothing items
- Filter by category, color, season, and occasion
- View detailed information about each item
- Edit or delete items as needed

### 🤖 AI-Powered Features
- **Smart Clothing Analysis**: Automatically analyze uploaded clothing photos to extract:
  - Category, color, pattern, material
  - Style, fit, and suitable occasions
  - Seasonal recommendations
- **Outfit Suggestions**: Get AI-generated outfit combinations based on:
  - Natural language queries ("What should I wear for a job interview?")
  - Your existing wardrobe items
  - Occasion-based recommendations

### 👔 Virtual Try-On
- Upload a photo of yourself
- Select clothes from your wardrobe
- Generate realistic try-on images using AI
- Download generated images

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Fetch API** - HTTP requests

## Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:3000`

## Installation

1. Clone the repository and navigate to frontend:
```bash
cd lockerProejct/front-end
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in front-end directory
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
front-end/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   ├── ClothingCard.jsx
│   │   └── OutfitCard.jsx
│   ├── pages/             # Page components
│   │   ├── Login.jsx      # Authentication
│   │   ├── Register.jsx
│   │   ├── Wardrobe.jsx   # Main wardrobe view
│   │   ├── AddItem.jsx    # Add new clothing
│   │   ├── ItemDetail.jsx # Item details/edit
│   │   ├── Outfits.jsx    # Outfit suggestions
│   │   └── TryOutfits.jsx # Virtual try-on
│   ├── services/          # API service layer
│   │   ├── authService.js
│   │   ├── wardrobeService.js
│   │   └── tryOnService.js
│   ├── styles/            # CSS modules
│   │   └── *.module.css
│   └── App.jsx           # Root component & routing
├── public/               # Static assets
├── index.html
├── vite.config.js       # Vite configuration
└── package.json
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Pages Overview

### 1. Authentication (`/login`, `/register`)
- User registration and login
- JWT token-based authentication
- Protected route system

### 2. Wardrobe (`/wardrobe`)
- Grid view of all clothing items
- Filtering options:
  - Category (T-Shirt, Pants, Dress, etc.)
  - Color (Black, White, Blue, etc.)
  - Season (Spring, Summer, Fall, Winter)
  - Occasion (Casual, Work, Formal, etc.)
- Search functionality
- Quick actions for each item

### 3. Add Item (`/wardrobe/add`)
- Upload clothing photo
- Manual input or AI analysis option
- Fields:
  - Basic: Name, category, color, size, brand
  - Advanced: Pattern, material, style, fit
  - Arrays: Seasons, occasions, features

### 4. Item Detail (`/wardrobe/item/:id`)
- View complete item information
- Edit item details
- Delete item
- View AI analysis results

### 5. Outfit Suggestions (`/outfits`)
Two modes available:
- **AI Assistant**: Natural language queries for outfit suggestions
- **Classic**: Occasion-based filtering
- Returns complete outfit combinations from wardrobe

### 6. Try Outfits (`/try-outfits`)
- Upload personal photo
- Select clothes from wardrobe (3x3 grid view)
- Add optional styling instructions
- Generate and download try-on results

## API Integration

The frontend communicates with the backend through these main services:

### AuthService
- `login(email, password)`
- `register(name, email, password)`
- `logout()`
- `isAuthenticated()`

### WardrobeService
- `fetchClothes(filters)`
- `getClothingItem(id)`
- `addClothingItem(formData)`
- `updateClothingItem(id, formData)`
- `deleteClothingItem(id)`
- `analyzeClothing(imageBase64)`
- `getOutfitSuggestions(occasion)`
- `getAIOutfitSuggestions(query)`

### TryOnService
- `generateTryOn(userImage, clothingIds, prompt)`

## Styling

The app uses CSS Modules for component-scoped styling with a consistent design system:

- **Color Palette**:
  - Primary: Black (#000000)
  - Background: White (#FFFFFF)
  - Borders: Light Gray (#E5E5E5)
  - Text Secondary: Gray (#767676)

- **Typography**:
  - Clean, minimal sans-serif
  - Uppercase labels with letter spacing
  - Consistent sizing hierarchy

- **Components**:
  - No gradients or colorful elements
  - Clean borders and subtle shadows
  - Consistent spacing and padding
  - Responsive grid layouts

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api  # Backend API URL
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Tips

1. **Hot Module Replacement**: Vite provides fast HMR for instant updates
2. **API Proxy**: Configure in `vite.config.js` if needed for CORS
3. **Component Development**: Use CSS Modules for scoped styles
4. **State Management**: Currently using React hooks (useState, useEffect)
5. **Error Handling**: API services include error handling and user feedback

## Build and Deployment

1. Build for production:
```bash
npm run build
```

2. Output will be in `dist/` directory

3. Serve with any static file server:
```bash
npm run preview  # Local preview
# Or deploy to Netlify, Vercel, etc.
```

## Common Issues & Solutions

### CORS Errors
- Ensure backend has proper CORS configuration
- Check API_URL in environment variables

### Images Not Loading
- Verify backend static file serving
- Check image URLs include server prefix

### Authentication Issues
- Clear localStorage if token is corrupted
- Ensure backend JWT_SECRET matches

### Build Failures
- Clear node_modules and reinstall
- Check for syntax errors in JSX
- Verify all imports are correct

## Contributing

1. Follow existing code style
2. Use meaningful component and variable names
3. Keep components focused and reusable
4. Test all features before committing
5. Update README for new features

## License

Private project - All rights reserved