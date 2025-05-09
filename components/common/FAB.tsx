import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';

type FABProps = {
  icon: ReactNode;
  onPress: () => void;
};

export default function FAB({ icon, onPress }: FABProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});