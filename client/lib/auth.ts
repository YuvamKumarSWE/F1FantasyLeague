/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
import { api, setAccessToken, getAccessToken } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post('/users/login', { email, password });
    
    const { accessToken, data } = response.data;
    setAccessToken(accessToken);
    
    // Set a cookie to indicate authentication state for middleware
    if (typeof document !== 'undefined') {
      document.cookie = "isAuthenticated=true; path=/; max-age=604800"; // 7 days
    }
    
    return { success: true, user: data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
}

export async function signup(email: string, username: string, password: string) {
  try {
    const response = await api.post('/users/signup', { email, username, password });
    return { success: true, user: response.data.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Signup failed' 
    };
  }
}

export async function logout() {
  try {
    await api.post('/users/logout');
    setAccessToken(null);
    
    // Clear the authentication cookie when logging out
    if (typeof document !== 'undefined') {
      document.cookie = "isAuthenticated=false; path=/; max-age=0";
    }
    
    return { success: true };
  } catch (error : any) {
    // Even if logout fails, clear local token and cookie
    setAccessToken(null);
    if (typeof document !== 'undefined') {
      document.cookie = "isAuthenticated=false; path=/; max-age=0";
    }
    return { success: true };
  }
}

export async function getCurrentUser() {
  try {
    console.log("Checking current user with token:", getAccessToken() ? "Present" : "Missing");
    const response = await api.post('/users/me');
    
    // If we successfully get the user, set the auth cookie (in case it wasn't set)
    if (typeof document !== 'undefined') {
      document.cookie = "isAuthenticated=true; path=/; max-age=604800"; // 7 days
    }
    
    console.log("User data retrieved");
    return { success: true, user: response.data.data.user };
  } catch (error: any) {
    // If we can't get the user, clear the auth cookie
    if (typeof document !== 'undefined') {
      document.cookie = "isAuthenticated=false; path=/; max-age=0";
    }
    
    console.error("Failed to get current user:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to get user' 
    };
  }
}