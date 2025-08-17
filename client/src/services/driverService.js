import api from '../lib/axios';

export const driverService = {
  // Get all drivers
  getAllDrivers: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    // Add parameters if they exist
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    const response = await api.get(`/drivers?${searchParams.toString()}`);
    return response.data;
  }
};