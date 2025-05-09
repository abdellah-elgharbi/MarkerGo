import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useState } from 'react';
import { Inbox } from 'lucide-react-native';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';

export default function OrdersScreen() {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const renderItem = ({ item: order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(order)}
    >
      <View style={styles.orderCardHeader}>
        <Text style={styles.orderNumber}>Order #{order.id.slice(-4)}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
        <Text style={styles.orderItems}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>
          Total: <Text style={styles.orderTotalAmount}>${order.totalAmount.toFixed(2)}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Inbox size={72} color="#B0BEC5" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here once you make a purchase.
          </Text>
        </View>
      )}

      {selectedOrder && (
        <OrderDetailModal
          visible={detailModalVisible}
          order={selectedOrder}
          onClose={() => setDetailModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#263238',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  orderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    marginRight: 16,
  },
  orderItems: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 12,
  },
  orderTotal: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#263238',
  },
  orderTotalAmount: {
    fontFamily: 'Inter-SemiBold',
    color: '#00BFA5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#263238',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
  },
});