import api from '../lib/axios';

export const driverService = {
  // Get all drivers
  getDrivers: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      // Add parameters if they exist
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get(`/drivers?${searchParams.toString()}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch drivers',
        data: []
      };
    }
  },

  // Backward compatibility
  getAllDrivers: async (params = {}) => {
    return await driverService.getDrivers(params);
  }
};