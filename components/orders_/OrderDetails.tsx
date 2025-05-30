import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useOrders } from '@/hooks/useOrders';
import { MapPin, Phone, Mail } from 'lucide-react-native';
import OrderStatusSelector from './OrderStatusSelector';
import { Order } from '@/context/OrderContext';

type OrderDetailsProps = {
  order: Order;
  onStatusChange: (status: Order['status']) => void;
};

export default function OrderDetails({ order, onStatusChange }: OrderDetailsProps) {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | undefined) => {
    return (price || 0).toFixed(2);
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Order ID:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>#{order.id}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Date:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(order.createdAt)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Status:</Text>
          <OrderStatusSelector 
            currentStatus={order.status} 
            onStatusChange={onStatusChange} 
          />
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Name:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{order.customerName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textLight }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{order.customerEmail}</Text>
        </View>
        
        {order.customerPhone && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textLight }]}>Phone:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{order.customerPhone}</Text>
          </View>
        )}
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
        
        {order.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.productName}</Text>
              <Text style={[styles.itemQuantity, { color: colors.textLight }]}>
                Quantity: {item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              ${formatPrice(item.totalPrice)}
            </Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            ${formatPrice(order.totalAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
});