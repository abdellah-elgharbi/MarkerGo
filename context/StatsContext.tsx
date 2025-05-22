import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MOCK_SALES_DATA, MOCK_TOP_PRODUCTS, MOCK_SUMMARY } from '@/data/mockData';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

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
  const [salesData, setSalesData] = useState<SalesDataPoint[]>(MOCK_SALES_DATA);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(MOCK_TOP_PRODUCTS);
  const [summary, setSummary] = useState<SalesSummary>(MOCK_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales data from Firestore
  useEffect(() => {
    const salesRef = collection(db, 'sales');
    const salesQuery = query(salesRef, orderBy('date', 'desc'), limit(30));

    const unsubscribeSales = onSnapshot(salesQuery, 
      (snapshot) => {
        const salesDataPoints = snapshot.docs.map(doc => ({
          date: doc.data().date,
          amount: doc.data().amount
        })) as SalesDataPoint[];
        setSalesData(salesDataPoints);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching sales data:', error);
        setError('Failed to fetch sales data');
        setIsLoading(false);
      }
    );

    return () => unsubscribeSales();
  }, []);

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

  // Fetch sales summary from Firestore
  useEffect(() => {
    const summaryRef = collection(db, 'stats');
    const summaryQuery = query(summaryRef, limit(1));

    const unsubscribeSummary = onSnapshot(summaryQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const summaryData = snapshot.docs[0].data() as SalesSummary;
          setSummary(summaryData);
        }
      },
      (error) => {
        console.error('Error fetching sales summary:', error);
        setError('Failed to fetch sales summary');
      }
    );

    return () => unsubscribeSummary();
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