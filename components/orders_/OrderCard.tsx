import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ChevronRight } from 'lucide-react-native';
import { Order, OrderStatus } from '@/context/OrderContext';
import { useRouter } from 'expo-router';

type OrderCardProps = {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
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
        return colors.gray;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const handlePress = () => {
    router.push(`/orders/${order.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.orderId, { color: colors.textLight }]}>
            Order #{order.id.slice(-6)}
          </Text>
          <Text style={[styles.date, { color: colors.textLight }]}>
            {formatDate(order.createdAt)}
          </Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.customerInfo}>
        <Text style={[styles.customerName, { color: colors.text }]}>
          {order.customerName}
        </Text>
        <Text style={[styles.itemCount, { color: colors.textLight }]}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.total, { color: colors.primary }]}>
          ${order.totalAmount.toFixed(2)}
        </Text>
        <ChevronRight size={20} color={colors.gray} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});