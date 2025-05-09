import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  loading = false, 
  variant = 'primary',
  size = 'medium',
  icon,
  style,
  textStyle,
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.buttonDisabled,
        style,
      ]}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FFFFFF' : '#00BFA5'} 
          size="small"
        />
      ) : (
        <>
          {icon && <Text style={styles.iconContainer}>{icon}</Text>}
          <Text style={[
            styles.buttonText,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle,
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primary: {
    backgroundColor: '#00BFA5',
  },
  secondary: {
    backgroundColor: '#E0F2F1',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00BFA5',
  },
  white: {
    backgroundColor: '#FFFFFF',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#00BFA5',
  },
  outlineText: {
    color: '#00BFA5',
  },
  whiteText: {
    color: '#00BFA5',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconContainer: {
    marginRight: 8,
  },
});