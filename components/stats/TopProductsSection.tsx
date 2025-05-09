import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type TopProduct = {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  image?: string;
};

type TopProductsSectionProps = {
  products: TopProduct[];
};

export default function TopProductsSection({ products }: TopProductsSectionProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Top Selling Products</Text>
      
      <ScrollView contentContainerStyle={styles.productsContainer}>
        {products.map((product, index) => (
          <View 
            key={product.id} 
            style={[
              styles.productCard, 
              { backgroundColor: colors.background, borderColor: colors.border }
            ]}
          >
            <View style={styles.rankContainer}>
              <Text style={[styles.rank, { color: colors.primary }]}>#{index + 1}</Text>
            </View>
            
            {product.image && (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            )}
            
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                {product.name}
              </Text>
              
              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: colors.textLight }]}>Sold</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{product.totalSold}</Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: colors.textLight }]}>Revenue</Text>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>
                    ${product.revenue.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  productsContainer: {
    paddingBottom: 8,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
  },
  metric: {
    marginRight: 24,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});