import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MOCK_ORDERS } from '@/data/mockData';

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

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id) || null;
  }, [orders]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
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