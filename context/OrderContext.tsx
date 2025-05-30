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
  docId: string;  // Firestore document ID
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

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  totalSold: number;
  revenue: number;
  image?: string;
};

type OrderContextType = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  getOrderById: (docId: string) => Order | null;
  updateOrderStatus: (docId: string, status: OrderStatus) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'docId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
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
        docId: doc.id,
        ...doc.data()
      })) as Order[];
      
      console.log('Existing orders in Firestore:', existingOrders);
      
      // If no orders exist, create a sample order
      if (existingOrders.length === 0) {
        console.log('No orders found, creating sample order...');
        
        // First, check if we have any products
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        console.log('Available products:', products);
        
        if (products.length === 0) {
          console.log('No products found, creating a sample product first...');
          const sampleProduct = {
            name: 'Sample Product',
            description: 'A sample product for testing',
            price: 1.00,
            totalSold: 0,
            revenue: 0,
            image: 'https://via.placeholder.com/150'
          };
          
          const productRef = await addDoc(productsRef, sampleProduct);
          console.log('Sample product created with Firebase ID:', productRef.id);
          
          // Create sample order with the new product
          const sampleOrder = {
            customerId: 'sample-customer',
            customerName: 'Sample Customer',
            customerEmail: 'sample@example.com',
            customerPhone: '123-456-7890',
            items: [{
              id: productRef.id,
              productId: productRef.id,
              productName: 'Sample Product',
              quantity: 1,
              unitPrice: 1.00,
              totalPrice: 1.00
            }],
            status: 'pending' as OrderStatus,
            totalAmount: 1.00,
            shippingAddress: '123 Sample St'
          };
          
          const orderId = await createOrder(sampleOrder);
          console.log('Sample order created with Firebase ID:', orderId);
        } else {
          // Use the first available product
          const firstProduct = products[0];
          console.log('Using existing product:', firstProduct);
          
          const sampleOrder = {
            customerId: 'sample-customer',
            customerName: 'Sample Customer',
            customerEmail: 'sample@example.com',
            customerPhone: '123-456-7890',
            items: [{
              id: firstProduct.id,
              productId: firstProduct.id,
              productName: firstProduct.name,
              quantity: 1,
              unitPrice: firstProduct.price,
              totalPrice: firstProduct.price
            }],
            status: 'pending' as OrderStatus,
            totalAmount: firstProduct.price,
            shippingAddress: '123 Sample St'
          };
          
          const orderId = await createOrder(sampleOrder);
          console.log('Sample order created with Firebase ID:', orderId);
        }
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
          docId: doc.id, // Store the Firestore document ID separately
          ...doc.data()
        })) as (Order & { docId: string })[];
        console.log('=== Orders Updated from Firestore ===');
        console.log('Total orders:', ordersData.length);
        console.log('Firestore Document IDs:', ordersData.map(order => order.docId));
        console.log('Full orders data:', JSON.stringify(ordersData, null, 2));
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

  const getOrderById = useCallback((docId: string) => {
    return orders.find(order => order.docId === docId) || null;
  }, [orders]);

  const createOrder = async (orderData: Omit<Order, 'docId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const ordersRef = collection(db, 'orders');
      const now = new Date().toISOString();
      
      const newOrder = {
        ...orderData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(ordersRef, newOrder);
      console.log('Created new order with Firebase ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  };

  const updateOrderStatus = async (docId: string, status: OrderStatus): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== Starting Order Status Update ===');
      console.log('Update request:', { docId, status });
      console.log('Current orders in state:', orders.map(order => ({ docId: order.docId, status: order.status })));
      
      // First check if the order exists in our local state using docId
      const localOrder = orders.find(order => order.docId === docId);
      console.log('Local order found:', localOrder ? 'Yes' : 'No');
      if (localOrder) {
        console.log('Local order details:', JSON.stringify(localOrder, null, 2));
      }
      
      if (!localOrder) {
        console.error('Order not found in local state:', docId);
        throw new Error(`Order not found in local state: ${docId}`);
      }
      
      // Use the Firestore document ID directly
      const orderRef = doc(db, 'orders', docId);
      console.log('Firestore document reference created:', orderRef.path);
      
      // Check if order exists in Firestore
      const orderDoc = await getDoc(orderRef);
      console.log('Order document exists in Firestore:', orderDoc.exists());
      
      if (!orderDoc.exists()) {
        console.error('Order not found in Firestore:', docId);
        throw new Error(`Order not found in Firestore: ${docId}`);
      }
      
      // Order exists, update it
      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updating order with data:', updateData);
      await updateDoc(orderRef, updateData);
      console.log('Order updated in Firestore successfully');
      
      // Update local state using docId
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => 
          order.docId === docId
            ? { ...order, status, updatedAt: updateData.updatedAt }
            : order
        );
        console.log('Local state updated:', updatedOrders.map(order => ({ docId: order.docId, status: order.status })));
        return updatedOrders;
      });
      
      setIsLoading(false);
      console.log('=== Order Status Update Completed ===');
    } catch (error) {
      console.error('=== Error in Order Status Update ===');
      console.error('Error details:', error);
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