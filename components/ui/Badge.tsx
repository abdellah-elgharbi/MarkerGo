import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  value: number | string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function Badge({ 
  value, 
  color = '#00BFA5', 
  textColor = '#FFFFFF',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textAlign: 'center',
  },
});