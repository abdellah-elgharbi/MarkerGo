import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Order, OrderStatus } from '@/context/OrderContext';
import { MapPin, Phone, Mail } from 'lucide-react-native';
import OrderStatusSelector from './OrderStatusSelector';

type OrderDetailsProps = {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
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
        
        {order.customerPhone && (
          <View style={styles.contactRow}>
            <Phone size={16} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text }]}>{order.customerPhone}</Text>
          </View>
        )}
        
        <View style={styles.contactRow}>
          <Mail size={16} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>{order.customerEmail}</Text>
        </View>
        
        <View style={styles.contactRow}>
          <MapPin size={16} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>{order.shippingAddress}</Text>
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
        
        {order.items.map((item) => (
          <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            )}
            
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.productName}</Text>
              <Text style={[styles.itemPrice, { color: colors.textLight }]}>
                ${item.unitPrice.toFixed(2)} × {item.quantity}
              </Text>
            </View>
            
            <Text style={[styles.itemTotal, { color: colors.primary }]}>
              ${item.totalPrice.toFixed(2)}
            </Text>
          </View>
        ))}
        
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textLight }]}>Subtotal:</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textLight }]}>Shipping:</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>$0.00</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total:</Text>
            <Text style={[styles.grandTotalValue, { color: colors.primary }]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  totalsContainer: {
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  totalValue: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  grandTotalValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});