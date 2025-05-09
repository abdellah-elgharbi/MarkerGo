import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ShoppingCart, Star, Heart } from 'lucide-react-native';
import { useCart } from '@/hooks/useCart';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProductCardProps {
  product: any;
  onPress: () => void;
  viewMode: 'grid' | 'list';
}

export function ProductCard({ product, onPress, viewMode }: ProductCardProps) {
  const { addItem } = useCart();
  const scale = useSharedValue(1);
  const isFavorite = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
    addItem({ ...product, quantity: 1 });
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    isFavorite.value = !isFavorite.value;
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Star 
            key={index}
            size={12} 
            color={index < product.rating ? "#FFC107" : "#E0E0E0"}
            fill={index < product.rating ? "#FFC107" : "none"}
          />
        ))}
      </View>
      <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
    </View>
  );

  // Calcul du prix avec promotion si disponible
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  if (viewMode === 'list') {
    return (
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={[animatedStyle, { width: '100%' }]}
      >
        <TouchableOpacity 
          style={styles.listCard} 
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.listImageContainer}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.listImage}
              resizeMode="cover"
            />
            {product.isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPercentage}%</Text>
              </View>
            )}
          </View>
          
          <View style={styles.listContent}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            
            {renderRating()}
            
            <View style={styles.listFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                )}
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={toggleFavorite}
                >
                  <Heart 
                    size={16} 
                    color="#FF5252"
                    fill={isFavorite.value ? "#FF5252" : "none"}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddToCart}
                >
                  <ShoppingCart size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(400).delay((product.index || 0) * 50)} 
      style={[styles.gridCardContainer, animatedStyle]}
    >
      <TouchableOpacity 
        style={styles.gridCard} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.gridImageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.gridImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={styles.favoriteButtonOverlay}
            onPress={toggleFavorite}
          >
            <Heart 
              size={16} 
              color="#FF5252"
              fill={isFavorite.value ? "#FF5252" : "none"}
            />
          </TouchableOpacity>
          
          {product.isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </View>
          )}
        </View>
        
        <View style={styles.gridContent}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          
          {renderRating()}
          
          <View style={styles.gridFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <ShoppingCart size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {product.stock <= 5 && product.stock > 0 && (
          <View style={styles.stockWarning}>
            <Text style={styles.stockWarningText}>Seulement {product.stock} en stock</Text>
          </View>
        )}
        
        {product.stock === 0 && (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Rupture de stock</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // List View Styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  listImageContainer: {
    position: 'relative', 
    width: 120,
  },
  listImage: {
    width: 120,
    height: 120,
  },
  listContent: {
    flex: 1,
    padding: 10,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Grid View Styles
  gridCardContainer: {
    width: '48%',
    marginBottom: 12,
    marginHorizontal: '1%',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 'auto', // Hauteur adaptable au contenu
    maxHeight: 280,
  },
  gridImageContainer: {
    position: 'relative',
    width: '100%',
    height: 130,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridContent: {
    padding: 10,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  // Badge Styles
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  stockWarning: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingVertical: 4,
  },
  stockWarningText: {
    textAlign: 'center',
    color: '#212121',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  outOfStock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },

  // Common Styles
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#78909C',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#263238',
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#78909C',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#00BFA5',
  },
  originalPrice: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  favoriteButtonOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});