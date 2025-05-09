import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { OrderStatus } from '@/context/OrderContext';

type OrderStatusFilterProps = {
  selectedStatus: OrderStatus | 'all';
  onSelectStatus: (status: OrderStatus | 'all') => void;
};

export default function OrderStatusFilter({ selectedStatus, onSelectStatus }: OrderStatusFilterProps) {
  const { colors } = useTheme();
  
  const statuses: (OrderStatus | 'all')[] = [
    'all',
    'pending', 
    'processing', 
    'shipped', 
    'delivered', 
    'cancelled'
  ];
  
  const getStatusColor = (status: OrderStatus | 'all') => {
    if (status === selectedStatus) {
      switch (status) {
        case 'all':
          return colors.primary;
        case 'pending':
          return colors.warning;
        case 'processing':
          return colors.primary;
        case 'shipped':
          return colors.accent;
        case 'delivered':
          return colors.success;
        case 'cancelled':
          return colors.error;
        default:
          return colors.primary;
      }
    }
    return colors.card;
  };
  
  const getTextColor = (status: OrderStatus | 'all') => {
    return status === selectedStatus ? '#FFFFFF' : colors.text;
  };
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.pill, 
            { 
              backgroundColor: getStatusColor(status),
              borderColor: colors.border 
            }
          ]}
          onPress={() => onSelectStatus(status)}
        >
          <Text 
            style={[
              styles.pillText, 
              { color: getTextColor(status) }
            ]}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});