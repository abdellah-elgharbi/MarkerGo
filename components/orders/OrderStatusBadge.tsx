import { View, Text, StyleSheet } from 'react-native';

interface OrderStatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#78909C';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${getStatusColor()}20` }]}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.text, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});