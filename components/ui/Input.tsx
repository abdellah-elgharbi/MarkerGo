import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ReactNode } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  style,
  ...props 
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        style
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
          ]}
          placeholderTextColor="#9E9E9E"
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#546E7A',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#F44336',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#263238',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
});