import { useColorScheme } from 'react-native';

export type Colors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  card: string;
  text: string;
  textLight: string;
  border: string;
  gray: string;
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors: Colors = {
    primary: '#2D6A4F',
    primaryLight: '#40916C',
    primaryDark: '#1B4332',
    accent: '#FF7D00',
    accentLight: '#FF9E2A',
    accentDark: '#E56B00',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: isDark ? '#121212' : '#F9FAFB',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F9FAFB' : '#111827',
    textLight: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#2E2E2E' : '#E5E7EB',
    gray: '#9CA3AF',
  };

  return {
    isDark,
    colors,
  };
}