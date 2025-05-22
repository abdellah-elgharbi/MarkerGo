import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { FirebaseErrorHandler } from '@/utils/errorHandling';

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
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          await storage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        await storage.removeItem('user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as User;
      setUser(userData);
      
      // Navigate based on user type
      if (userData.userType === 'client') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs_)');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(FirebaseErrorHandler.handleError(error));
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
      
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Please fill in all required fields');
      }
      
      if (userData.userType === 'seller' && !userData.storeName) {
        throw new Error('Store name is required for sellers');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Create user document in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        name: userData.name,
        email: userData.email,
        storeName: userData.storeName || '',
        userType: userData.userType
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
      
      // Navigate based on user type
      if (userData.userType === 'client') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs_)');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(FirebaseErrorHandler.handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      await storage.removeItem('user');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(FirebaseErrorHandler.handleError(error));
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, userData);
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await storage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(FirebaseErrorHandler.handleError(error));
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      // Reauthenticate user before changing password
      await signInWithEmailAndPassword(auth, user?.email || '', oldPassword);
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error(FirebaseErrorHandler.handleError(error));
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