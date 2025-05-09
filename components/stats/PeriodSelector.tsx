import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Period = 'week' | 'month' | 'year';

type PeriodSelectorProps = {
  selectedPeriod: Period;
  onSelectPeriod: (period: Period) => void;
};

export default function PeriodSelector({ selectedPeriod, onSelectPeriod }: PeriodSelectorProps) {
  const { colors } = useTheme();
  
  const periods: Period[] = ['week', 'month', 'year'];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.button,
            { 
              backgroundColor: selectedPeriod === period ? colors.primary : 'transparent',
              borderColor: selectedPeriod === period ? colors.primary : 'transparent'
            }
          ]}
          onPress={() => onSelectPeriod(period)}
        >
          <Text 
            style={[
              styles.buttonText,
              { color: selectedPeriod === period ? '#FFFFFF' : colors.textLight }
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});