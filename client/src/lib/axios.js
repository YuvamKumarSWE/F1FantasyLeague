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
        detail: { 
          message: 'Server is starting up after inactivity. Please wait a moment...',
          type: 'spinup'
        }
      });
      window.dispatchEvent(event);
    }
    
    // Handle general 404 errors (server not responding or routing issues)
    else if (error.response?.status === 404) {
      const event = new CustomEvent('serverError', { 
        detail: { 
          message: 'Server is temporarily unavailable. Please try again in a moment.',
          type: 'unavailable',
          status: 404
        }
      });
      window.dispatchEvent(event);
    }
    
    // Handle network errors (server completely down)
    else if (!error.response) {
      const event = new CustomEvent('serverError', { 
        detail: { 
          message: 'Unable to connect to server. Please check your connection and try again.',
          type: 'network',
          status: 'NETWORK_ERROR'
        }
      });
      window.dispatchEvent(event);
    }
    
    // Handle other server errors (5xx)
    else if (error.response?.status >= 500) {
      const event = new CustomEvent('serverError', { 
        detail: { 
          message: 'Server error occurred. Please try again later.',
          type: 'server_error',
          status: error.response.status
        }
      });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default api;