import { ScrollView, View, StyleSheet } from 'react-native';
import { useStats } from '@/context/StatsContext';
import Header from '@/components/common/Header';
import SalesChart from '@/components/stats/SalesChart';
import TopProductsSection from '@/components/stats/TopProductsSection';
import StatsSummary from '@/components/stats/StatsSummary';
import PeriodSelector from '@/components/stats/PeriodSelector';
import { useState } from 'react';

type Period = 'week' | 'month' | 'year';

export default function StatsScreen() {
  const { salesData, topProducts, summary } = useStats();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

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
        
        <StatsSummary summary={summary} period={selectedPeriod} />
        
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