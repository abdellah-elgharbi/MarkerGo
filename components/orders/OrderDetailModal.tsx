import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Image,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
}

export function OrderDetailModal({ 
  visible, 
  order, 
  onClose,
}: OrderDetailModalProps) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#263238" />
          </TouchableOpacity>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderNumber}>Order #{order.id.slice(-4)}</Text>
            <OrderStatusBadge status={order.status} />
          </View>
          
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.date)}
          </Text>
        </View>

        <FlatList
          data={order.items}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                {item.selectedVariant && (
                  <Text style={styles.itemVariant}>Variant: {item.selectedVariant}</Text>
                )}
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.itemsList}
          ListFooterComponent={() => (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${order.totalAmount.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#263238',
  },
  closeButton: {
    padding: 8,
  },
  orderInfo: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  orderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  itemsList: {
    paddingTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#263238',
    marginBottom: 4,
  },
  itemVariant: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#78909C',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#00BFA5',
  },
  itemQuantity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#F5F7FA',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
  summaryTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#263238',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ECEFF1',
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  totalValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#00BFA5',
  },
});