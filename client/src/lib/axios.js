import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add a request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    // Handle server spin-down (common with free tier hosting)
    if (error.response?.status === 404 && error.config?.url?.includes('/users/')) {
      // Show server spin-up alert for auth endpoints
      const event = new CustomEvent('serverSpinUp', { 
        detail: { message: 'Server is starting up after inactivity. Please wait a moment...' }
      });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default api;