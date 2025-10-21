import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class WardrobeService {
  constructor() {
    this.clothes = [];
    this.filters = { category: '', color: '', search: '' };
  }
  
  async fetchClothes(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Only add filters that have values
      if (filters.category) params.append('category', filters.category);
      if (filters.color) params.append('color', filters.color);
      if (filters.search) params.append('search', filters.search);
      if (filters.season) params.append('season', filters.season);
      if (filters.occasion) params.append('occasion', filters.occasion);
      
      const queryString = params.toString();
      const url = `${API_URL}/clothes${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to fetch clothes');
      }
      
      const data = await response.json();
      this.clothes = data.items || data;
      return { success: true, data: this.clothes };
    } catch (error) {
      console.error('Fetch clothes error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async getClothingItem(id) {
    try {
      const response = await fetch(`${API_URL}/clothes/${id}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to fetch item');
      }
      
      const data = await response.json();
      return { success: true, data: data.item };
    } catch (error) {
      console.error('Get item error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async addClothingItem(formData) {
    try {
      // Convert image to base64
      const imageFile = formData.get('image');
      let base64Image = null;
      if (imageFile) {
        base64Image = await this.fileToBase64(imageFile);
      }

      // Build JSON object
      const jsonData = {
        name: formData.get('name'),
        category: formData.get('category_name'),
        color: formData.get('color_name'),
        image: base64Image
      };

      // Add optional fields
      const optionalFields = ['brand', 'notes', 'pattern', 'material', 'style', 'fit', 'gender'];
      optionalFields.forEach(field => {
        const value = formData.get(field);
        if (value) jsonData[field] = value;
      });

      // Add array fields
      const arrayFields = ['season', 'occasion', 'features'];
      arrayFields.forEach(field => {
        const value = formData.get(field);
        if (value) jsonData[field] = value; // Already JSON string from form
      });

      console.log('Sending data to backend (image truncated):', { ...jsonData, image: jsonData.image ? `${jsonData.image.substring(0, 50)}...` : null });

      // Send as JSON
      const response = await fetch(`${API_URL}/clothes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      const data = await response.json();
      this.clothes.push(data.item);
      return { success: true, data: data.item };
    } catch (error) {
      console.error('Add item error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async updateClothingItem(id, updateData) {
    try {
      let jsonData = {};

      // If updateData is FormData, convert it
      if (updateData instanceof FormData) {
        // Convert image to base64 if present
        const imageFile = updateData.get('image');
        if (imageFile && imageFile instanceof File) {
          jsonData.image = await this.fileToBase64(imageFile);
        }

        // Extract all other fields
        for (let [key, value] of updateData.entries()) {
          if (key !== 'image') {
            jsonData[key] = value;
          }
        }
      } else {
        jsonData = { ...updateData };
        // Ensure array fields are properly formatted
        if (jsonData.season && Array.isArray(jsonData.season)) {
          jsonData.season = JSON.stringify(jsonData.season);
        }
        if (jsonData.occasion && Array.isArray(jsonData.occasion)) {
          jsonData.occasion = JSON.stringify(jsonData.occasion);
        }
        if (jsonData.features && Array.isArray(jsonData.features)) {
          jsonData.features = JSON.stringify(jsonData.features);
        }
      }

      const response = await fetch(`${API_URL}/clothes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(jsonData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to update item');
      }

      const data = await response.json();
      const index = this.clothes.findIndex(item => item._id === id || item.id === id);
      if (index !== -1) {
        this.clothes[index] = data.item;
      }
      return { success: true, data: data.item };
    } catch (error) {
      console.error('Update item error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async deleteClothingItem(id) {
    try {
      const response = await fetch(`${API_URL}/clothes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to delete item');
      }
      
      this.clothes = this.clothes.filter(item => item._id !== id && item.id !== id);
      return { success: true };
    } catch (error) {
      console.error('Delete item error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async getOutfitSuggestions(occasion) {
    try {
      const response = await fetch(`${API_URL}/outfits/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ occasion })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to get suggestions');
      }
      
      const data = await response.json();
      return { success: true, data: data.outfits };
    } catch (error) {
      console.error('Get suggestions error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async analyzeClothingImage(imageFile) {
    try {
      // Convert image to base64
      const base64 = await this.fileToBase64(imageFile);
      
      const response = await fetch(`${API_URL}/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ image: base64 })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        throw new Error('Failed to analyze image');
      }
      
      const data = await response.json();
      return { 
        success: data.success, 
        data: data.analysis,
        message: data.message 
      };
    } catch (error) {
      console.error('Analyze image error:', error);
      return { success: false, error: error.message };
    }
  }
  
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
  }
  
  getFilters() {
    return this.filters;
  }
  
  getClothes() {
    return this.clothes;
  }

  async getAIOutfitSuggestions(query) {
    try {
      const response = await fetch(`${API_URL}/outfits/suggest-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI suggestions');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get AI suggestions error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const wardrobeService = new WardrobeService();