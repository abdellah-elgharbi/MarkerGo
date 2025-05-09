import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import { MOCK_USER } from '@/data/mockData';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  storeName: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Simulate loading user from storage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user', error);
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Simulate API call - in a real app, validate against backend
      if (email === 'demo@example.com' && password === 'password') {
        const authenticatedUser = { ...MOCK_USER, email };
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        router.replace('/(tabs)');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      setIsLoading(true);

      // Basic validation
      if (!userData.email || !userData.password || !userData.name || !userData.storeName) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API call - in a real app, send to backend
      const newUser = {
        ...MOCK_USER,
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        storeName: userData.storeName,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      router.replace('/(tabs)');
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.replace('/auth/login');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
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