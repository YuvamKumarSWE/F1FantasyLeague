'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Try to fetch current user (if backend exposes /users/me)
  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me').catch(() => null);
      if (res && res.data) setUser(res.data.user || res.data);
    } finally {
      setLoading(false);
      setBootstrapDone(true);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Adjust endpoint if your server uses a different path
      const res = await api.post('/users/login', { email, password });
      setUser(res.data.user || res.data);
      router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.post('/users/logout').catch(() => {});
    } finally {
      setUser(null);
      setLoading(false);
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading: loading && !bootstrapDone, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};