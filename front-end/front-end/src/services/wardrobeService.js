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
      // Create new FormData with proper field names for backend
      const uploadData = new FormData();
      
      // Add the image file
      const imageFile = formData.get('image');
      if (imageFile) {
        uploadData.append('image', imageFile);
      }
      
      // Add basic required fields
      uploadData.append('name', formData.get('name'));
      uploadData.append('category', formData.get('category_name'));
      uploadData.append('color', formData.get('color_name'));
      
      // Add optional basic fields
      const size = formData.get('size');
      if (size) uploadData.append('size', size);
      
      const brand = formData.get('brand');
      if (brand) uploadData.append('brand', brand);
      
      const notes = formData.get('notes');
      if (notes) uploadData.append('notes', notes);
      
      // Add new schema fields
      const pattern = formData.get('pattern');
      if (pattern) uploadData.append('pattern', pattern);
      
      const material = formData.get('material');
      if (material) uploadData.append('material', material);
      
      const style = formData.get('style');
      if (style) uploadData.append('style', style);
      
      const fit = formData.get('fit');
      if (fit) uploadData.append('fit', fit);
      
      const gender = formData.get('gender');
      if (gender) uploadData.append('gender', gender);
      
      // Add array fields (they come as JSON strings from the form)
      const season = formData.get('season');
      if (season) uploadData.append('season', season);
      
      const occasion = formData.get('occasion');
      if (occasion) uploadData.append('occasion', occasion);
      
      const features = formData.get('features');
      if (features) uploadData.append('features', features);
      
      console.log('Sending data to backend:');
      for (let [key, value] of uploadData.entries()) {
        if (key !== 'image') {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      // Send as FormData (no Content-Type header needed for FormData)
      const response = await fetch(`${API_URL}/clothes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: uploadData
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
      // If updateData is FormData, handle it differently
      let body;
      let headers = {
        'Authorization': `Bearer ${authService.getToken()}`
      };
      
      if (updateData instanceof FormData) {
        body = updateData;
        // Don't set Content-Type for FormData, let browser set it
      } else {
        headers['Content-Type'] = 'application/json';
        // Ensure array fields are properly formatted
        if (updateData.season && Array.isArray(updateData.season)) {
          updateData.season = JSON.stringify(updateData.season);
        }
        if (updateData.occasion && Array.isArray(updateData.occasion)) {
          updateData.occasion = JSON.stringify(updateData.occasion);
        }
        if (updateData.features && Array.isArray(updateData.features)) {
          updateData.features = JSON.stringify(updateData.features);
        }
        body = JSON.stringify(updateData);
      }
      
      const response = await fetch(`${API_URL}/clothes/${id}`, {
        method: 'PUT',
        headers,
        body
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