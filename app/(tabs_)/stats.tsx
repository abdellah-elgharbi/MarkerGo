import { ScrollView, View, StyleSheet } from 'react-native';
import { useStats } from '@/context/StatsContext';
import Header from '@/components/common/Header';
import SalesChart from '@/components/stats/SalesChart';
import TopProductsSection from '@/components/stats/TopProductsSection';
import StatsSummary from '@/components/stats/StatsSummary';
import PeriodSelector from '@/components/stats/PeriodSelector';
import { useState, useMemo } from 'react';

type Period = 'week' | 'month' | 'year';

export default function StatsScreen() {
  const { salesData, topProducts } = useStats();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

  // Helper to get start date for period
  function getStartDate(period: Period): Date {
    const now = new Date();
    if (period === 'week') {
      now.setDate(now.getDate() - 6);
    } else if (period === 'month') {
      now.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      now.setFullYear(now.getFullYear() - 1);
    }
    now.setHours(0, 0, 0, 0);
    return now;
  }

  // Compute summary for selected period
  const periodSummary = useMemo(() => {
    const startDate = getStartDate(selectedPeriod);
    console.log('Start date for period:', startDate.toISOString());
    console.log('All sales data:', salesData);
    
    const filtered = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      console.log('Comparing sale date:', saleDate.toISOString(), 'with start date:', startDate.toISOString());
      return saleDate >= startDate;
    });
    console.log('Filtered sales:', filtered);
    
    const totalSales = filtered.reduce((sum, sale) => sum + sale.amount, 0);
    const totalOrders = filtered.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    console.log('Calculated summary:', {
      totalSales,
      totalOrders,
      averageOrderValue
    });
    
    // Calculate growth: compare this period to previous period
    let salesGrowth = 0;
    if (filtered.length > 0) {
      const prevStart = getStartDate(selectedPeriod);
      if (selectedPeriod === 'week') prevStart.setDate(prevStart.getDate() - 7);
      if (selectedPeriod === 'month') prevStart.setMonth(prevStart.getMonth() - 1);
      if (selectedPeriod === 'year') prevStart.setFullYear(prevStart.getFullYear() - 1);
      const prevEnd = getStartDate(selectedPeriod);
      prevEnd.setDate(prevEnd.getDate() - 1);
      
      console.log('Previous period:', {
        start: prevStart.toISOString(),
        end: prevEnd.toISOString()
      });
      
      const prevFiltered = salesData.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= prevStart && saleDate < startDate;
      });
      console.log('Previous period sales:', prevFiltered);
      
      const prevTotal = prevFiltered.reduce((sum, sale) => sum + sale.amount, 0);
      if (prevTotal > 0) {
        salesGrowth = Math.round(((totalSales - prevTotal) / prevTotal) * 100);
      } else if (totalSales > 0) {
        salesGrowth = 100;
      }
    }
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      salesGrowth,
    };
  }, [salesData, selectedPeriod]);

  return (
    <View style={styles.container}>
      <Header title="Statistics" />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />
        
        <StatsSummary summary={periodSummary} period={selectedPeriod} />
        
        <SalesChart 
          data={salesData} 
          period={selectedPeriod}
        />
        
        <TopProductsSection products={topProducts} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});