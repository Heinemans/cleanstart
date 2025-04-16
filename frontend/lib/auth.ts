import axios from 'axios';

// API client with cookie handling
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true, // Important for cookies to be sent and received
});

export interface User {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth state management
let currentUser: User | null = null;

// Check if the user is authenticated on the client side
export const isAuthenticated = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const user = await getUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

// Login user and set auth cookie
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post('/api/login', credentials);
    currentUser = response.data.user;
    return currentUser;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

// Logout and clear cookie
export const logout = async (): Promise<void> => {
  try {
    await api.post('/api/logout');
    currentUser = null;
  } catch (error) {
    console.error('Logout failed', error);
    throw new Error('Logout failed');
  }
};

// Get current authenticated user
export const getUser = async (): Promise<User | null> => {
  if (currentUser) {
    return currentUser;
  }
  
  try {
    const response = await api.get('/api/me');
    currentUser = response.data.user;
    return currentUser;
  } catch (error) {
    return null;
  }
}; 