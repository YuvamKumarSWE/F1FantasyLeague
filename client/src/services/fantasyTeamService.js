import api from '../lib/axios';

export const fantasyTeamService = {
  // Create a new fantasy team
  createTeam: async (teamData) => {
    try {
      const response = await api.post('/ft', teamData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating fantasy team:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create fantasy team',
        data: null
      };
    }
  },

  // Get team for a specific race
  getTeam: async (raceId) => {
    try {
      const response = await api.get(`/ft/${raceId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching fantasy team:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch fantasy team',
        data: null
      };
    }
  },

  // Get all user's fantasy teams
  getUserTeams: async () => {
    try {
      const response = await api.get('/ft/me');
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching user fantasy teams:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user fantasy teams',
        data: null
      };
    }
  }
};
