import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '@/context/OrderContext';
import NavigationHeader from '@/components/common/NavigationHeader';
import OrderDetails from '@/components/orders_/OrderDetails';
import { Order, OrderStatus } from '@/context/OrderContext';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, orders } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      console.log('Fetching order with ID:', id);
      console.log('Available orders:', orders.map(o => o.id));
      
      const fetchedOrder = getOrderById(id);
      if (!fetchedOrder) {
        console.error('Order not found:', id);
        setError('Order not found');
        setLoading(false);
        return;
      }
      
      setOrder(fetchedOrder);
      setLoading(false);
    }
  }, [id, getOrderById, orders]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      if (!order) {
        throw new Error('No order selected');
      }
      
      console.log('Updating order status:', { orderId: order.id, newStatus });
      await updateOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Order Details" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationHeader title="Order Details" onBack={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <OrderDetails 
          order={order}
          onStatusChange={handleStatusChange}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});