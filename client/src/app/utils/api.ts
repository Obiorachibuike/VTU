'use client';

/**
 * Central API client.
 *
 * All calls go to `/api/...` on the app's own origin; next.config.js rewrites
 * proxy them to the Express backend (SERVER_URL env). The JWT is attached
 * from localStorage automatically.
 */
import axios from 'axios';

export const TOKEN_KEY = 'token';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      // token expired/invalid — drop it so guards redirect to login
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
};

export const apiErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    return error.message || fallback;
  }
  return fallback;
};

export const formatNaira = (value: number | string | undefined | null): string => {
  const n = Number(value ?? 0);
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default api;
