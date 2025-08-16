// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { 
  login as apiLogin, 
  logout as apiLogout, 
  getCurrentUser, 
  signup as apiSignup,
  User 
} from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const result = await getCurrentUser();
    if (result.success) {
      setUser(result.user);
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    const result = await apiLogin(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }

  async function signup(email: string, username: string, password: string) {
    const result = await apiSignup(email, username, password);
    if (result.success) {
      // Note: signup doesn't automatically log in, so don't set user here
    }
    return result;
  }

  async function logout() {
    await apiLogout();
    setUser(null);
    
    // Optionally redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return { 
    user, 
    login, 
    signup, 
    logout, 
    loading,
    isAuthenticated: !!user 
  };
}