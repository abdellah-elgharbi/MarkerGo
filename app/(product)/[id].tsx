import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { fetchProductById } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ShoppingCart, Star, Truck as TruckIcon, Plus, Minus, ChevronDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [expandedSection, setExpandedSection] = useState('description');
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const productData = await fetchProductById(id);
      setProduct(productData);
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        ...product,
        quantity,
        selectedVariant,
      });
      
      // Reset quantity after adding to cart
      setQuantity(1);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#263238" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#263238" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <ShoppingCart size={24} color="#263238" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Image 
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <Animated.View 
          style={styles.productInfo}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Star 
                  key={index}
                  size={16} 
                  color={index < product.rating ? "#FFC107" : "#CFD8DC"}
                  fill={index < product.rating ? "#FFC107" : "none"}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)} ({product.reviews} reviews)</Text>
          </View>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          {product.variants && product.variants.length > 0 && (
            <View style={styles.variantsContainer}>
              <Text style={styles.variantsTitle}>Variants:</Text>
              <View style={styles.variantButtons}>
                {product.variants.map((variant, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.variantButton,
                      selectedVariant === variant && styles.selectedVariant,
                    ]}
                    onPress={() => setSelectedVariant(variant)}
                  >
                    <Text
                      style={[
                        styles.variantButtonText,
                        selectedVariant === variant && styles.selectedVariantText,
                      ]}
                    >
                      {variant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={16} color={quantity <= 1 ? "#B0BEC5" : "#263238"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Plus size={16} color="#263238" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <TruckIcon size={16} color="#00BFA5" />
            <Text style={styles.deliveryText}>Free shipping • 2-3 day delivery</Text>
          </View>

          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('description')}
          >
            <Text style={styles.sectionTitle}>Description</Text>
            <ChevronDown size={20} color="#78909C" style={{ transform: [{ rotate: expandedSection === 'description' ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
          
          {expandedSection === 'description' && (
            <Text style={styles.description}>{product.description}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('details')}
          >
            <Text style={styles.sectionTitle}>Product Details</Text>
            <ChevronDown size={20} color="#78909C" style={{ transform: [{ rotate: expandedSection === 'details' ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
          
          {expandedSection === 'details' && (
            <View style={styles.detailsContainer}>
              {product.details && Object.entries(product.details).map(([key, value]) => (
                <View key={key} style={styles.detailItem}>
                  <Text style={styles.detailKey}>{key}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          icon={<ShoppingCart size={20} color="#FFFFFF" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  cartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
  },
  content: {
    paddingBottom: 100,
  },
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFFFFF',
  },
  productInfo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
  },
  category: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00BFA5',
    marginBottom: 8,
  },
  productName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#263238',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  price: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#00BFA5',
    marginBottom: 24,
  },
  variantsContainer: {
    marginBottom: 24,
  },
  variantsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    marginBottom: 12,
  },
  variantButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ECEFF1',
    marginRight: 12,
    marginBottom: 12,
  },
  selectedVariant: {
    backgroundColor: '#E0F2F1',
    borderWidth: 1,
    borderColor: '#00BFA5',
  },
  variantButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#78909C',
  },
  selectedVariantText: {
    color: '#00BFA5',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    marginRight: 16,
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
    width: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    width: 40,
    textAlign: 'center',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    marginBottom: 24,
  },
  deliveryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#00695C',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailKey: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#78909C',
    width: 120,
  },
  detailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#546E7A',
    flex: 1,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
});