import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Product, ProductCategory } from '@/context/ProductContext';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus } from 'lucide-react-native';

type ProductFormProps = {
  product?: Product;
  onSubmit: (productData: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

export default function ProductForm({ product, onSubmit, onCancel, isEditing = false }: ProductFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [stock, setStock] = useState(product?.stock.toString() || '');
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'other');
  const [image, setImage] = useState(product?.image || '');
  
  const categories: ProductCategory[] = [
    'fruits', 
    'vegetables', 
    'dairy', 
    'meat', 
    'bakery', 
    'beverages', 
    'other'
  ];

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      if (source === 'camera') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error picking an image:', error);
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !description || !stock || !category) {
      return;
    }
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      stock: parseInt(stock, 10),
      category,
      image: image || 'https://images.pexels.com/photos/6941883/pexels-photo-6941883.jpeg?auto=compress&cs=tinysrgb&w=600',
    };
    
    onSubmit(productData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image 
            source={{ uri: image }} 
            style={styles.image}
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.border }]}>
            <ImagePlus size={48} color={colors.gray} />
          </View>
        )}
        
        <View style={styles.imageActions}>
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: colors.primary }]}
            onPress={() => pickImage('camera')}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.imageButton, { backgroundColor: colors.primary }]}
            onPress={() => pickImage('gallery')}
          >
            <ImagePlus size={20} color="#FFFFFF" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border }]}
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.textArea, { borderColor: colors.border }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your product"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border }]}
          value={stock}
          onChangeText={setStock}
          placeholder="0"
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton, 
                { 
                  backgroundColor: category === cat ? colors.primary : colors.card,
                  borderColor: colors.border 
                }
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  { color: category === cat ? '#FFFFFF' : colors.text }
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  submitButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});