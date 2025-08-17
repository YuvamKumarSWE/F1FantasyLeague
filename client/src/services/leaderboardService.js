import api from '../lib/axios';

export const leaderboardService = {
  getLeaderboard: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(`/leaderboard?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },
  getMyRank: async () => {
    try {
      const response = await api.get(`/leaderboard/my-rank`);
      return response.data;
    } catch (error) {
      console.error('Error fetching my rank:', error);
      throw error;
    }
  }
};
