/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
import { api, setAccessToken } from './api';

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
    return { success: true };
  } catch (error : any) {
    // Even if logout fails, clear local token
    setAccessToken(null);
    return { success: true };
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.post('/users/me');
    return { success: true, user: response.data.data.user };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to get user' 
    };
  }
}