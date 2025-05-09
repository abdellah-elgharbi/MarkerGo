import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft } from 'lucide-react-native';

type NavigationHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function NavigationHeader({ title, onBack }: NavigationHeaderProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity 
        onPress={onBack}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  placeholder: {
    width: 40,
  },
});