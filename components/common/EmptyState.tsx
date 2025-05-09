import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Package, ShoppingBag, ChartBar as BarChart3 } from 'lucide-react-native';

type EmptyStateProps = {
  title: string;
  description: string;
  icon: 'package' | 'shopping-bag' | 'chart';
};

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  const { colors } = useTheme();
  
  const renderIcon = () => {
    switch (icon) {
      case 'package':
        return <Package size={48} color={colors.gray} />;
      case 'shopping-bag':
        return <ShoppingBag size={48} color={colors.gray} />;
      case 'chart':
        return <BarChart3 size={48} color={colors.gray} />;
      default:
        return <Package size={48} color={colors.gray} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
        {renderIcon()}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textLight }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginVertical: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    maxWidth: 250,
  },
});