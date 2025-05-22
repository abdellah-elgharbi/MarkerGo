import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { collection, doc, updateDoc, onSnapshot, addDoc, getDoc, getDocs, setDoc } from 'firebase/firestore';
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
  isLoading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  syncOrders: () => Promise<void>;
};

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to sync orders with Firestore
  const syncOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      const existingOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      console.log('Existing orders in Firestore:', existingOrders);
      
      // If no orders exist, create a sample order
      if (existingOrders.length === 0) {
        console.log('No orders found, creating sample order...');
        const sampleOrder = {
          customerId: 'sample-customer',
          customerName: 'Sample Customer',
          customerEmail: 'sample@example.com',
          customerPhone: '123-456-7890',
          items: [{
            id: 'item1',
            productId: 'product1',
            productName: 'Sample Product',
            quantity: 1,
            unitPrice: 1.00,
            totalPrice: 1.00
          }],
          status: 'pending' as OrderStatus,
          totalAmount: 1.00,
          shippingAddress: '123 Sample St'
        };
        
        await createOrder(sampleOrder);
        console.log('Sample order created');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error syncing orders:', error);
      setError('Failed to sync orders');
      setIsLoading(false);
    }
  };

  // Fetch orders from Firestore
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(ordersRef, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        console.log('Orders updated from Firestore:', ordersData);
        setOrders(ordersData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
        setIsLoading(false);
      }
    );

    // Initial sync
    syncOrders();

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id) || null;
  }, [orders]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const ordersRef = collection(db, 'orders');
      const now = new Date().toISOString();
      
      const newOrder = {
        ...orderData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(ordersRef, newOrder);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to update order:', { id, status });
      
      const orderRef = doc(db, 'orders', id);
      
      // Check if order exists
      const orderDoc = await getDoc(orderRef);
      console.log('Order document exists:', orderDoc.exists());
      
      if (!orderDoc.exists()) {
        throw new Error(`Order not found in Firestore: ${id}`);
      }
      
      // Order exists, update it
      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updating order with data:', updateData);
      await updateDoc(orderRef, updateData);
      console.log('Order updated in Firestore');
      
      // Verify the update was successful
      const updatedDoc = await getDoc(orderRef);
      if (!updatedDoc.exists() || updatedDoc.data().status !== status) {
        throw new Error('Order status update verification failed');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    orders,
    isLoading,
    error,
    getOrderById,
    updateOrderStatus,
    createOrder,
    syncOrders,
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