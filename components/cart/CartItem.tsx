import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCart } from '@/hooks/useCart';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { router } from 'expo-router';

interface CartItemProps {
  item: any;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();

  const handleIncrementQuantity = () => {
    updateItemQuantity(item.id, item.quantity + 1, item.selectedVariant);
  };

  const handleDecrementQuantity = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1, item.selectedVariant);
    }
  };

  const handleRemoveItem = () => {
    removeItem(item.id, item.selectedVariant);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
        
        {item.selectedVariant && (
          <Text style={styles.variant}>Variant: {item.selectedVariant}</Text>
        )}
        
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.actions}>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={handleDecrementQuantity}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} color={item.quantity <= 1 ? "#B0BEC5" : "#263238"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={handleIncrementQuantity}
            >
              <Plus size={16} color="#263238" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={handleRemoveItem}
          >
            <Trash2 size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    marginBottom: 4,
  },
  variant: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#00BFA5',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
    width: 32,
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#263238',
    width: 32,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
});