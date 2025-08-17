import api from '../lib/axios';

export const standingsService = {
  getStandings: async () => {
    try {
      const response = await api.get(`/standings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
};
