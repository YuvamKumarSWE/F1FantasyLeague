import  api  from '../lib/axios';

export const raceService = {
  // Get all races with optional year filter
  getRaces: async (year = '2025') => {
    try {
      const response = await api.get(`/races?year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching races:', error);
      throw error;
    }
  },

  // Get current (next upcoming) race
  getNextRace: async () => {
    try {
      const response = await api.get('/races/next');
      return response.data;
    } catch (error) {
      console.error('Error fetching next race:', error);
      throw error;
    }
  },

  // Get completed races
  getCompletedRaces: async (year = '2025', limit = '10') => {
    try {
      const response = await api.get(`/races/completed?year=${year}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed races:', error);
      throw error;
    }
  },

  // Get upcoming races
  getUpcomingRaces: async (year = '2025', limit = '5') => {
    try {
      const response = await api.get(`/races/upcoming?year=${year}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming races:', error);
      throw error;
    }
  },

  // Get race status by ID
  getRaceStatus: async (raceId) => {
    try {
      const response = await api.get(`/races/${raceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching race status:', error);
      throw error;
    }
  }
};