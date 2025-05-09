import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search } from 'lucide-react-native';

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ placeholder, value, onChangeText }: SearchBarProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Search size={20} color={colors.gray} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});