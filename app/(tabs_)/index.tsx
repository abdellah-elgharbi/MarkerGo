import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import ProductCard from '@/components/products_/ProductCard';
import FAB from '@/components/common/FAB';
import { ProductCategory, useProducts } from '@/context/ProductContext';
import CategoryFilter from '@/components/products_/CategoryFilter';
import EmptyState from '@/components/common/EmptyState';
import { ProductProvider } from '@/context/ProductContext';
export default function ProductsScreen() {
  const router = useRouter();
  const { products, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useFocusEffect(
    useCallback(() => {
      // Refresh data when screen is focused if needed
    }, [])
  );

  const handleAddProduct = () => {
    router.push('/products/new');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
  };

  return (
    <View style={styles.container}>
      <Header title="My Products" />
      
      <View style={styles.filterContainer}>
        <SearchBar
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={() => handleEditProduct(item.id)}
            onDelete={() => handleDeleteProduct(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No products found"
            description="Add your first product to get started"
            icon="package"
          />
        }
      />
      
      <FAB 
        icon={<Plus color="#FFF" size={24} />}
        onPress={handleAddProduct} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
});