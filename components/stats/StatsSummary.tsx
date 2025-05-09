import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign } from 'lucide-react-native';

type StatsSummaryProps = {
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesGrowth: number;
  };
  period: 'week' | 'month' | 'year';
};

export default function StatsSummary({ summary, period }: StatsSummaryProps) {
  const { colors } = useTheme();
  
  const isPositiveGrowth = summary.salesGrowth >= 0;
  
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <DollarSign size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textLight }]}>Total Sales</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${summary.totalSales.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
          <ShoppingCart size={20} color={colors.accent} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textLight }]}>Orders</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {summary.totalOrders}
          </Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
          <Package size={20} color={colors.success} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textLight }]}>Average Order</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${summary.averageOrderValue.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: (isPositiveGrowth ? colors.success : colors.error) + '20' }
        ]}>
          {isPositiveGrowth ? (
            <TrendingUp size={20} color={colors.success} />
          ) : (
            <TrendingDown size={20} color={colors.error} />
          )}
        </View>
        <View>
          <Text style={[styles.label, { color: colors.textLight }]}>Growth</Text>
          <Text style={[
            styles.value, 
            { color: isPositiveGrowth ? colors.success : colors.error }
          ]}>
            {isPositiveGrowth ? '+' : ''}{summary.salesGrowth}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});