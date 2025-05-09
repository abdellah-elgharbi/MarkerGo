import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '@/context/OrderContext';
import NavigationHeader from '@/components/common/NavigationHeader';
import OrderDetails from '@/components/orders_/OrderDetails';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedOrder = getOrderById(id);
      setOrder(fetchedOrder);
      setLoading(false);
    }
  }, [id, getOrderById]);

  const handleStatusChange = (newStatus: any) => {
    updateOrderStatus(id, newStatus);
    setOrder((prev: any) => ({ ...prev, status: newStatus }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
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
});