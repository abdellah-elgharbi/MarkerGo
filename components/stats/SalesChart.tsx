import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LineChart } from 'react-native-chart-kit';

type SalesChartProps = {
  data: { date: string; amount: number }[];
  period: 'week' | 'month' | 'year';
};

export default function SalesChart({ data, period }: SalesChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // padding
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Sales Trend {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
      </Text>
      
      <LineChart
        data={{
          labels: data.map(d => d.date),
          datasets: [
            {
              data: data.map(d => d.amount),
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 32} // chart padding
        height={220}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 0,
          color: () => colors.primary,
          labelColor: () => colors.textLight,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
  },
  chart: {
    marginRight: -32, // compensate for chart padding
  },
});