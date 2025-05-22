import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from './useAuth';
import { FirebaseErrorHandler } from '@/utils/errorHandling';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariant?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, variant?: string) => void;
  updateItemQuantity: (itemId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load cart from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const cartRef = doc(db, 'carts', user.id);
    
    // Set up real-time listener for cart changes
    const unsubscribe = onSnapshot(
      cartRef,
      (doc) => {
        if (doc.exists()) {
          const cartData = doc.data();
          setItems(cartData.items || []);
        } else {
          setItems([]);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading cart:', error);
        setError(FirebaseErrorHandler.handleError(error));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveCartToFirestore = async (newItems: CartItem[]) => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'carts', user.id);
      await setDoc(cartRef, { items: newItems }, { merge: true });
    } catch (error) {
      console.error('Error saving cart:', error);
      setError(FirebaseErrorHandler.handleError(error));
    }
  };

  const addItem = async (newItem: CartItem) => {
    try {
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.id === newItem.id && item.selectedVariant === newItem.selectedVariant
        );

        let newItems;
        if (existingItemIndex >= 0) {
          newItems = [...prevItems];
          newItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          newItems = [...prevItems, newItem];
        }

        // Save to Firestore
        saveCartToFirestore(newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError(FirebaseErrorHandler.handleError(error));
    }
  };

  const removeItem = async (itemId: string, variant?: string) => {
    try {
      setItems(prevItems => {
        const newItems = prevItems.filter(item => 
          !(item.id === itemId && item.selectedVariant === variant)
        );
        // Save to Firestore
        saveCartToFirestore(newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError(FirebaseErrorHandler.handleError(error));
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number, variant?: string) => {
    try {
      setItems(prevItems => {
        const newItems = prevItems.map(item => 
          item.id === itemId && item.selectedVariant === variant
            ? { ...item, quantity }
            : item
        );
        // Save to Firestore
        saveCartToFirestore(newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError(FirebaseErrorHandler.handleError(error));
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
      if (user) {
        const cartRef = doc(db, 'carts', user.id);
        await setDoc(cartRef, { items: [] });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(FirebaseErrorHandler.handleError(error));
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        isLoading,
        error
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}