import api from '../lib/axios';

export const resultService = {
  // Get race results for a specific race
  getRaceResults: async (raceId) => {
    try {
      const response = await api.get(`/results/${raceId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching race results:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch race results',
        data: null
      };
    }
  },

  // Get fantasy points for all drivers in a specific race
  getFantasyPoints: async (raceId) => {
    try {
      const response = await api.get(`/results/${raceId}/fantasy-points`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching fantasy points:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch fantasy points',
        data: null
      };
    }
  }
};