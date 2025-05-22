import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useOrders } from './OrderContext';

type SalesDataPoint = {
  date: string;
  amount: number;
};

type TopProduct = {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  image?: string;
};

type SalesSummary = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
};

type StatsContextType = {
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  summary: SalesSummary;
  isLoading: boolean;
  error: string | null;
};

// Create context
const StatsContext = createContext<StatsContextType | undefined>(undefined);

// Provider component
export function StatsProvider({ children }: { children: ReactNode }) {
  const { orders } = useOrders();
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [summary, setSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    salesGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate sales data from delivered orders
  useEffect(() => {
    try {
      const deliveredOrders = orders.filter(order => order.status === 'delivered');
      
      // Create sales data points from delivered orders
      const salesPoints = deliveredOrders.map(order => ({
        date: order.updatedAt,
        amount: order.totalAmount
      }));
      
      setSalesData(salesPoints);
      
      // Calculate summary
      const totalSales = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = deliveredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      
      // Calculate growth (comparing last 30 days with previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      const recentOrders = deliveredOrders.filter(order => 
        new Date(order.updatedAt) >= thirtyDaysAgo
      );
      const previousOrders = deliveredOrders.filter(order => 
        new Date(order.updatedAt) >= sixtyDaysAgo && 
        new Date(order.updatedAt) < thirtyDaysAgo
      );
      
      const recentTotal = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const previousTotal = previousOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      let salesGrowth = 0;
      if (previousTotal > 0) {
        salesGrowth = Math.round(((recentTotal - previousTotal) / previousTotal) * 100);
      } else if (recentTotal > 0) {
        salesGrowth = 100;
      }
      
      setSummary({
        totalSales,
        totalOrders,
        averageOrderValue,
        salesGrowth
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error calculating stats:', error);
      setError('Failed to calculate statistics');
      setIsLoading(false);
    }
  }, [orders]);

  // Fetch top products from Firestore
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const topProductsQuery = query(
      productsRef,
      where('totalSold', '>', 0),
      orderBy('totalSold', 'desc'),
      limit(5)
    );

    const unsubscribeTopProducts = onSnapshot(topProductsQuery,
      (snapshot) => {
        const topProductsData = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          totalSold: doc.data().totalSold,
          revenue: doc.data().revenue,
          image: doc.data().image
        })) as TopProduct[];
        setTopProducts(topProductsData);
      },
      (error) => {
        console.error('Error fetching top products:', error);
        setError('Failed to fetch top products');
      }
    );

    return () => unsubscribeTopProducts();
  }, []);

  const value = {
    salesData,
    topProducts,
    summary,
    isLoading,
    error
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

// Custom hook to use the stats context
export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}