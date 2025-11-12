import api from '../lib/axios';

export const aiService = {
  /**
   * Send a query to the AI chatbot
   * @param {string} query - The user's question
   * @returns {Promise<Object>} Response containing the AI's answer
   */
  chat: async (query) => {
    try {
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        throw new Error('Query must be a non-empty string');
      }

      const response = await api.post('/ai/chat', {
        query: query.trim()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error communicating with AI:', error);
      throw error;
    }
  }
};
