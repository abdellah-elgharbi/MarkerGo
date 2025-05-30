import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Product } from '@/context/ProductContext';
import { CreditCard as Edit2, Trash2, ShoppingBag, Star } from 'lucide-react-native';
import { useRef, useState, useEffect } from 'react';

type ProductCardProps = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart?: () => void;
};

export default function ProductCard({ product, onEdit, onDelete, onAddToCart }: ProductCardProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const getBadgeColor = () => {
    if (product.stock <= 0) return colors.error;
    if (product.stock <= 5) return colors.warning;
    return colors.success;
  };
  
  const getStockText = () => {
    if (product.stock <= 0) return 'Out of stock';
    if (product.stock <= 5) return `Only ${product.stock} left`;
    return `${product.stock} in stock`;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          opacity: animatedValue,
          transform: [
            { translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.card }]}
          onPress={toggleFavorite}
        >
          <Star 
            size={18} 
            color={isFavorite ? colors.warning : colors.textLight} 
            fill={isFavorite ? colors.warning : 'transparent'} 
          />
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
          <Text style={styles.badgeText}>{getStockText()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.category, { color: colors.textLight }]}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${product.price.toFixed(2)}
          </Text>
        </View>
        
        <Text style={[styles.description, { color: colors.textLight }]} numberOfLines={2}>
          {product.description}
        </Text>
        
        <View style={styles.footer}>
          {onAddToCart && (
            <TouchableOpacity
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
              onPress={onAddToCart}
            >
              <ShoppingBag size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
              onPress={onEdit}
            >
              <Edit2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={onDelete}
            >
              <Trash2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 16,
    minHeight: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});