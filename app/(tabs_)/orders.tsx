import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/components/common/Header';
import OrderCard from '@/components/orders_/OrderCard';
import SearchBar from '@/components/common/SearchBar';
import OrderStatusFilter from '@/components/orders_/OrderStatusFilter';
import { OrderStatus, useOrders } from '@/context/OrderContext';
import EmptyState from '@/components/common/EmptyState';

export default function OrdersScreen() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      // Refresh orders when screen is focused if needed
    }, [])
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

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
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No orders found"
            description="Orders will appear here when customers make purchases"
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
});