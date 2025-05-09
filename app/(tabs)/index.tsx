import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { fetchProducts, fetchCategories } from '@/utils/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { ScrollView } from 'react-native-gesture-handler';
import { View as ViewGrid, List, Search, ShoppingBag } from 'lucide-react-native';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterProductsByCategory = () => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const handleProductPress = (product) => {
  router.push(`/(product)/${product.id}`);
};
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.logoText}>MarketGo</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => router.push('/search')}
          >
            <Search size={24} color="#263238" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List size={24} color="#263238" />
            ) : (
              <ViewGrid size={24} color="#263238" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <ShoppingBag size={24} color="#fff" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Summer Sale!</Text>
            <Text style={styles.bannerSubtitle}>Save up to 50% off</Text>
          </View>
        </View>
        <Button 
          title="Shop Now" 
          onPress={() => router.push('/search')} 
          variant="white"
          size="small"
          style={styles.bannerButton} 
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'all' && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === 'all' && styles.categoryButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.name && styles.categoryButtonTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.productsHeader}>
        <Text style={styles.productsTitle}>Featured Products</Text>
      </View>
    </>
  );

  if (viewMode === 'grid') {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={filterProductsByCategory()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
              viewMode="grid"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filterProductsByCategory()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            viewMode="list"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  logoText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#00BFA5',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  viewToggle: {
    padding: 8,
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#00BFA5',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    marginLeft: 12,
  },
  bannerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E0F2F1',
  },
  bannerButton: {
    minWidth: 100,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#ECEFF1',
  },
  categoryButtonActive: {
    backgroundColor: '#00BFA5',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#78909C',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  productsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#263238',
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
  },
});