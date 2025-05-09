import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ProductCategory } from '@/context/ProductContext';

type CategoryFilterProps = {
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
};

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { colors } = useTheme();
  
  const categories: ProductCategory[] = [
    'fruits', 
    'vegetables', 
    'dairy', 
    'meat', 
    'bakery', 
    'beverages', 
    'other'
  ];
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.pill, 
          { 
            backgroundColor: selectedCategory === null ? colors.primary : colors.card,
            borderColor: colors.border 
          }
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text 
          style={[
            styles.pillText, 
            { color: selectedCategory === null ? '#FFFFFF' : colors.text }
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.pill, 
            { 
              backgroundColor: selectedCategory === category ? colors.primary : colors.card,
              borderColor: colors.border 
            }
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text 
            style={[
              styles.pillText, 
              { color: selectedCategory === category ? '#FFFFFF' : colors.text }
            ]}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});