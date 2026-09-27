'use client';

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import api, { setToken, clearToken, apiErrorMessage } from '../../utils/api';

export interface Wallet {
  balance: number;
  currency: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  transactions: any[];
  notifications?: any[];
  wallet: Wallet;
  referralCode: string;
  referralCount: number;
  isVerified?: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  loginWithToken: (token: string) => Promise<boolean>;
  fetchUserDetails: (token: string) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = useCallback(async (token: string): Promise<User | null> => {
    const response = await api.get('/auth/user/details', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200 && response.data.user) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    }
    return null;
  }, []);

  // Login with an existing JWT (e.g. stored in localStorage)
  const loginWithToken = useCallback(
    async (token: string) => {
      setIsLoading(true);
      try {
        setToken(token);
        const loaded = await loadUser(token);
        return Boolean(loaded);
      } catch {
        clearToken();
        setIsAuthenticated(false);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadUser]
  );

  // kept for backwards compatibility with existing pages
  const fetchUserDetails = useCallback(
    (token: string) => {
      setIsLoading(true);
      loadUser(token)
        .then((loaded) => {
          if (!loaded) console.warn('Failed to fetch user details');
        })
        .catch((error) => {
          console.error(apiErrorMessage(error));
          setIsAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    },
    [loadUser]
  );

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;
    try {
      return await loadUser(token);
    } catch {
      return null;
    }
  }, [loadUser]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, loginWithToken, fetchUserDetails, refreshUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
