'use client';

import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Wallet {
  balance: number;
  currency: string;
}

export interface AccountTransaction {
  _id?: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  description?: string;
  date?: string;
  time?: string;
  reference?: string;
  category?: string;
  mode?: string;
  metadata?: Record<string, unknown>;
}

export interface User {
  name: string;
  email: string;
  role?: string;
  transactions: AccountTransaction[];
  wallet: Wallet;
  referralCode: string;
  referralCount: number;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  fetchUserDetails: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/auth/user/details', { withCredentials: true });

      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUserDetails();
    // Cookie-based session is checked once when the app loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, fetchUserDetails }}
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