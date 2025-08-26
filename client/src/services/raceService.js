import api from '../lib/axios';

export const raceService = {
  // Get all races with optional year filter
  getRaces: async (year = '2025') => {
    try {
      const response = await api.get(`/races?year=${year}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching races:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch races',
        data: []
      };
    }
  },

  // Get current (next upcoming) race
  getNextRace: async () => {
    try {
      const response = await api.get('/races/next');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching next race:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch next race',
        data: null
      };
    }
  },

  // Get completed races
  getCompletedRaces: async (year = '2025', limit = '10') => {
    try {
      const response = await api.get(`/races/completed?year=${year}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching completed races:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch completed races',
        data: []
      };
    }
  },

  // Get upcoming races
  getUpcomingRaces: async (year = '2025', limit = '5') => {
    try {
      const response = await api.get(`/races/upcoming?year=${year}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching upcoming races:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch upcoming races',
        data: []
      };
    }
  },

  // Get race status by ID
  getRaceStatus: async (raceId) => {
    try {
      const response = await api.get(`/races/${raceId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching race status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch race status',
        data: null
      };
    }
  }
};