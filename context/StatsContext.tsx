import { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_SALES_DATA, MOCK_TOP_PRODUCTS, MOCK_SUMMARY } from '@/data/mockData';

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
};

// Create context
const StatsContext = createContext<StatsContextType | undefined>(undefined);

// Provider component
export function StatsProvider({ children }: { children: ReactNode }) {
  const [salesData] = useState<SalesDataPoint[]>(MOCK_SALES_DATA);
  const [topProducts] = useState<TopProduct[]>(MOCK_TOP_PRODUCTS);
  const [summary] = useState<SalesSummary>(MOCK_SUMMARY);

  const value = {
    salesData,
    topProducts,
    summary,
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