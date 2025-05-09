import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#263238" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>
        
        <View style={styles.content}>
          {!isSubmitted ? (
            <>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              
              <View style={styles.inputGroup}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error}
                  leftIcon={<Mail size={20} color="#9E9E9E" />}
                />
              </View>
              
              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => router.replace('/login')}
                style={styles.backToLoginButton}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#263238',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#00BFA5',
    marginBottom: 16,
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backToLoginButton: {
    width: '100%',
  },
});