import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { MOCK_ORDERS } from '@/data/mockData';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
};

type OrderContextType = {
  orders: Order[];
  getOrderById: (id: string) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Fetch orders from Firestore
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id) || null;
  }, [orders]);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      // Fallback to local state update if Firebase update fails
      setOrders(prev =>
        prev.map(order => 
          order.id === id 
            ? { 
                ...order, 
                status, 
                updatedAt: new Date().toISOString() 
              } 
            : order
        )
      );
    }
  };

  const value = {
    orders,
    getOrderById,
    updateOrderStatus,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

// Custom hook to use the order context
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}