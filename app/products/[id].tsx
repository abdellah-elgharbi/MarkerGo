import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/context/ProductContext';
import NavigationHeader from '@/components/common/NavigationHeader';
import ProductForm from '@/components/products_/ProductForm';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById, updateProduct } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedProduct = getProductById(id);
      setProduct(fetchedProduct);
      setLoading(false);
    }
  }, [id, getProductById]);

  const handleSubmit = (productData: any) => {
    updateProduct(id, productData);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <NavigationHeader title="Edit Product" onBack={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm 
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});