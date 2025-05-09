import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartJSON = await storage.getItem('cart');
        if (cartJSON) {
          setItems(JSON.parse(cartJSON));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await storage.setItem('cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart, including the variant if present
      const existingItemIndex = prevItems.findIndex(
        item => item.id === newItem.id && item.selectedVariant === newItem.selectedVariant
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (itemId: string, variant?: string) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && item.selectedVariant === variant)
      )
    );
  };

  const updateItemQuantity = (itemId: string, quantity: number, variant?: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
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