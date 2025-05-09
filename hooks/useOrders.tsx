import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariant?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

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

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from storage on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersJSON = await storage.getItem('orders');
        if (ordersJSON) {
          setOrders(JSON.parse(ordersJSON));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  // Save orders to storage whenever it changes
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await storage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    };

    saveOrders();
  }, [orders]);

  const addOrder = (newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}