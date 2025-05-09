import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { MOCK_USER } from '@/data/mockData';

// Ajout du type d'utilisateur à l'interface User
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  storeName?: string;
  avatar?: string;
  userType: 'client' | 'seller'; // Ajout du type d'utilisateur
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    storeName?: string;
    userType: 'client' | 'seller'; // Ajout du type d'utilisateur
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Platform-specific storage helpers
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on startup
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        const userJSON = await storage.getItem('user');
        if (userJSON) {
          setUser(JSON.parse(userJSON));
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate against backend
      // For demo purposes, we'll accept a demo login or any login like the original implementation
      let authenticatedUser: User;
      
      if (email === 'demo@example.com' && password === 'password') {
        authenticatedUser = { 
          ...MOCK_USER, 
          email,
          userType: 'client' // Default type for demo user
        };
      } else {
        // Default mock user (from first implementation)
        authenticatedUser = {
          id: '1',
          name: 'John Doe',
          email: email,
          userType: 'client' // Default type
        };
      }

      // Save user to storage
      await storage.setItem('user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      
      // Navigation adaptative selon le type d'utilisateur
      if (authenticatedUser.userType === 'client') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs_)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    storeName?: string;
    userType: 'client' | 'seller';
  }) => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validation spécifique au type d'utilisateur
      if (userData.userType === 'seller' && !userData.storeName) {
        throw new Error('Store name is required for sellers');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user combining approaches from both implementations
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        storeName: userData.storeName || '',
        userType: userData.userType
      };

      // Save user to storage
      await storage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Navigation adaptative selon le type d'utilisateur
      if (userData.userType === 'client') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs_)');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

 const logout = async () => {
  console.log("ff")
  try {
    // Remove user from storage
    await storage.removeItem('user');
    setUser(null);
    
    // Correction du chemin de navigation
    router.replace('/(auth)/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        await storage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the old and new passwords to the API
      // For mock purposes, we'll just pretend it succeeded
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}