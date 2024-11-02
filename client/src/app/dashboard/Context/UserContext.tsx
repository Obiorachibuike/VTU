'use client'; // Ensures the frontend code is executed client-side

import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Wallet {
  balance: number;
  currency: string;
}

interface User {
  name: string;
  email: string;
  transactions: any[]; // Replace 'any' with the appropriate type based on your data
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
  fetchUserDetails: (token: string) => void; // Function to fetch user details based on token
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserDetails = async (token: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/api/auth/user/details', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data.user);
      

      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        alert('Failed to fetch user details. Please try again.');
        setIsAuthenticated(false);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || 'Failed to fetch user details'}`);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, isLoading, fetchUserDetails }}>
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
