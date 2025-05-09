import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ProductCard } from '@/components/products/ProductCard';
import { fetchProducts, fetchCategories } from '@/utils/api';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategories, products]);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      const categoriesData = await fetchCategories();
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    setFilteredProducts(filtered);
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSearchQuery('');
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#9E9E9E" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color={showFilters ? '#00BFA5' : '#263238'} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilters}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterSectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category.name) && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategoryToggle(category.name)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategories.includes(category.name) && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            viewMode="list"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          </View>
        }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#263238',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  clearFilters: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00BFA5',
  },
  filterSectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#78909C',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
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
  resultContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  productsList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#263238',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
  },
});