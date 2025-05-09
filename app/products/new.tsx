import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/context/ProductContext';
import NavigationHeader from '@/components/common/NavigationHeader';
import ProductForm from '@/components/products_/ProductForm';

export default function NewProductScreen() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const handleSubmit = (productData: any) => {
    addProduct(productData);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <NavigationHeader title="Add New Product" onBack={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});