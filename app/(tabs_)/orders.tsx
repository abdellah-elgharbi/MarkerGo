import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/components/common/Header';
import OrderCard from '@/components/orders_/OrderCard';
import SearchBar from '@/components/common/SearchBar';
import OrderStatusFilter from '@/components/orders_/OrderStatusFilter';
import { OrderStatus, useOrders } from '@/context/OrderContext';
import EmptyState from '@/components/common/EmptyState';
import { useTheme } from '@/hooks/useTheme';

export default function OrdersScreen() {
  const { orders, updateOrderStatus, isLoading, error, syncOrders } = useOrders();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Refresh orders when screen is focused
      syncOrders();
    }, [syncOrders])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, [syncOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
      // You might want to show an error message to the user here
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <EmptyState
          title="Error Loading Orders"
          description={error}
          icon="shopping-bag"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Orders" />
      
      <View style={styles.filterContainer}>
        <SearchBar
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <OrderStatusFilter
          selectedStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />
      </View>
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onStatusChange={(newStatus) => handleStatusChange(item.id, newStatus)}
            isUpdating={updatingOrderId === item.id}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No orders found"
            description="Pull down to refresh or create a new order"
            icon="shopping-bag"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
});