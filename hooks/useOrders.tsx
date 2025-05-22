import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { collection, doc, setDoc, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from './useAuth';
import { FirebaseErrorHandler } from '@/utils/errorHandling';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariant?: string;
  unitPrice?: number;
  totalPrice?: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  isLoading: boolean;
  error: string | null;
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

// Helper function to ensure order items have all required price fields
const ensureOrderItemFields = (item: OrderItem): OrderItem => {
  const unitPrice = item.unitPrice || item.price || 0;
  const quantity = item.quantity || 1;
  return {
    ...item,
    price: item.price || unitPrice,
    unitPrice,
    totalPrice: unitPrice * quantity,
    quantity
  };
};

// Helper function to ensure order has all required fields
const ensureOrderFields = (order: any): Order => {
  const items = (order.items || []).map(ensureOrderItemFields);
  const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + (item.totalPrice || 0), 0);
  
  return {
    id: order.id || '',
    items,
    totalAmount: order.totalAmount || totalAmount,
    status: order.status || 'pending',
    date: order.date || new Date().toISOString(),
    customerId: order.customerId || '',
    customerName: order.customerName || 'Unknown Customer',
    customerEmail: order.customerEmail || '',
    shippingAddress: order.shippingAddress || ''
  };
};

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load orders from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(
      ordersRef,
      where('customerId', '==', user.id),
      orderBy('date', 'desc')
    );
    
    // Set up real-time listener for orders
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ensureOrderFields({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading orders:', error);
        setError(FirebaseErrorHandler.handleError(error));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to place an order');
      }

      const ordersRef = collection(db, 'orders');
      const newOrder = ensureOrderFields({
        ...orderData,
        date: new Date().toISOString(),
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email
      });

      const docRef = await addDoc(ordersRef, newOrder);
      
      // Update local state
      setOrders(prevOrders => [{
        ...newOrder,
        id: docRef.id
      }, ...prevOrders]);
    } catch (error) {
      console.error('Error adding order:', error);
      setError(FirebaseErrorHandler.handleError(error));
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { status }, { merge: true });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(FirebaseErrorHandler.handleError(error));
      throw error;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        isLoading,
        error
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