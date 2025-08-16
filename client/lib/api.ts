// lib/api.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store access token in memory
let accessToken: string | null = null;
let isRefreshing = false; // Add flag to prevent multiple refresh attempts

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor - automatically add token to requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - automatically handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get 401 and haven't already tried to refresh AND we're not already refreshing
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE}/users/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user is not authenticated
        isRefreshing = false;
        setAccessToken(null);
        console.log(refreshError);
        
        // Don't redirect automatically, let components handle it
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);