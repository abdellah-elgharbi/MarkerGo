import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { useOrders } from '@/hooks/useOrders';
import { ShoppingBag } from 'lucide-react-native';
import { useState } from 'react';
import { PaymentModal } from '@/components/cart/PaymentModal';

export default function CartScreen() {
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some products first!');
      return;
    }
    
    setPaymentModalVisible(true);
  };

  const handlePaymentSuccess = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const newOrder = {
        id: Date.now().toString(),
        items: [...items],
        totalAmount: calculateTotal(),
        status: 'pending',
        date: new Date().toISOString(),
      };
      
      addOrder(newOrder);
      clearCart();
      setLoading(false);
      setPaymentModalVisible(false);
      
      // Navigate to orders screen
      router.push('/orders');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
      </View>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => <CartItem item={item} />}
            keyExtractor={(item) => `${item.id}-${item.selectedVariant || 'default'}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${calculateTotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
            </View>

            <Button
              title="Checkout"
              onPress={handleCheckout}
              style={styles.checkoutButton}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <ShoppingBag size={72} color="#B0BEC5" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/')}
            style={styles.startShoppingButton}
          />
        </View>
      )}
      
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onPaymentSuccess={handlePaymentSuccess}
        totalAmount={calculateTotal()}
        loading={loading}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
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
  checkoutButton: {
    marginTop: 16,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#263238',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 24,
  },
  startShoppingButton: {
    minWidth: 200,
  },
});