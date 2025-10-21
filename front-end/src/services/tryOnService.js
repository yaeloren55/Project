import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class TryOnService {
  async generateTryOn(userImage, clothingIds, prompt = '') {
    try {
      const response = await fetch(`${API_URL}/try-on/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          userImage,
          clothingIds,
          prompt
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          return { success: false, error: 'Session expired' };
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate try-on');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Try-on service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate try-on image'
      };
    }
  }
}

export const tryOnService = new TryOnService();