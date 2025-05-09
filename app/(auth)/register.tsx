import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Store, ShoppingBag } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userType, setUserType] = useState('client'); // 'client' ou 'seller'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    storeName: ''
  });
  
  const { register, isLoading } = useAuth();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      storeName: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Only validate store name if user type is seller
    if (userType === 'seller' && !storeName.trim()) {
      newErrors.storeName = 'Store name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register({
          name,
          email,
          password,
          storeName: userType === 'seller' ? storeName : '',
          userType
        });
      } catch (error) {
        alert(error.message || 'Registration failed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#263238" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Fill in the details to create your account</Text>

            {/* User Type Selection */}
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>I am a:</Text>
              <View style={styles.userTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    userType === 'client' && styles.userTypeOptionSelected
                  ]}
                  onPress={() => setUserType('client')}
                >
                  <ShoppingBag 
                    size={24} 
                    color={userType === 'client' ? '#00BFA5' : '#9E9E9E'} 
                  />
                  <Text style={[
                    styles.userTypeText,
                    userType === 'client' && styles.userTypeTextSelected
                  ]}>Client</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.userTypeOption,
                    userType === 'seller' && styles.userTypeOptionSelected
                  ]}
                  onPress={() => setUserType('seller')}
                >
                  <Store 
                    size={24} 
                    color={userType === 'seller' ? '#00BFA5' : '#9E9E9E'} 
                  />
                  <Text style={[
                    styles.userTypeText,
                    userType === 'seller' && styles.userTypeTextSelected
                  ]}>Seller</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={errors.name}
                leftIcon={<User size={20} color="#9E9E9E" />}
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<Mail size={20} color="#9E9E9E" />}
              />
            </View>

            {/* Store Name field only shown for sellers */}
            {userType === 'seller' && (
              <View style={styles.inputGroup}>
                <Input
                  label="Store Name"
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="Enter your store name"
                  autoCapitalize="words"
                  error={errors.storeName}
                  leftIcon={<Store size={20} color="#9E9E9E" />}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon={<Lock size={20} color="#9E9E9E" />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                  </TouchableOpacity>
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                leftIcon={<Lock size={20} color="#9E9E9E" />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                  </TouchableOpacity>
                }
              />
            </View>

            <Button
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
    marginBottom: 20,
  },
  userTypeContainer: {
    marginBottom: 28,
  },
  userTypeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    marginBottom: 12,
  },
  userTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginHorizontal: 6,
  },
  userTypeOptionSelected: {
    borderColor: '#00BFA5',
    backgroundColor: 'rgba(0, 191, 165, 0.08)',
  },
  userTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#263238',
    marginLeft: 8,
  },
  userTypeTextSelected: {
    color: '#00BFA5',
  },
  inputGroup: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  loginLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00BFA5',
  },
});