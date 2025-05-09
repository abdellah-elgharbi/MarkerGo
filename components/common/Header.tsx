import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
  },
});