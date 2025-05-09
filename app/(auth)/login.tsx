import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, LogIn, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const inputsAnim = useRef(new Animated.Value(40)).current;
  const buttonAnim = useRef(new Animated.Value(40)).current;
  
  // Updated to use isLoading from our combined AuthContext
  const { login, isLoading } = useAuth();

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Sequence of animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(inputsAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return () => {
      StatusBar.setBarStyle('default');
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

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

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    setLoginAttempted(true);
    
    if (validateForm()) {
      try {
        // Visual feedback animation
        Animated.sequence([
          Animated.timing(buttonAnim, {
            toValue: 5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(buttonAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
        
        await login(email, password);
      } catch (error: any) {
        // Shake animation for error
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
        
        alert(error.message || 'Login failed');
      }
    } else {
      // Shake animation for validation error
      Animated.sequence([
        Animated.timing(inputsAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(inputsAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(inputsAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(inputsAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Add a demo login method for quick testing
  const handleDemoLogin = async () => {
    try {
      await login('demo@example.com', 'password');
    } catch (error: any) {
      alert(error.message || 'Demo login failed');
    }
  };

  const getInputStyle = (errorField: string) => {
    return loginAttempted && errors[errorField] ? { borderColor: '#FF5252' } : {};
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={['#0AB0A0', '#07897D']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { scale: logoScale }
              ]
            }
          ]}
        >
          <View style={styles.logoIconContainer}>
            <ShoppingCart size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.logo}>MarketGo</Text>
          <Text style={styles.logoSubtitle}>Your one-stop shopping solution</Text>
        </Animated.View>
      </LinearGradient>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[
            styles.formCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <View style={styles.formHeader}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <Animated.View style={{ transform: [{ translateY: inputsAnim }] }}>
              <View style={styles.inputGroup}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (loginAttempted) validateForm();
                  }}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={loginAttempted ? errors.email : ''}
                  leftIcon={<Mail size={20} color={loginAttempted && errors.email ? '#FF5252' : '#9E9E9E'} />}
                  style={getInputStyle('email')}
                  containerStyle={styles.inputContainer}
                />
              </View>

              <View style={styles.inputGroup}>
                <Input
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (loginAttempted) validateForm();
                  }}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  error={loginAttempted ? errors.password : ''}
                  leftIcon={<Lock size={20} color={loginAttempted && errors.password ? '#FF5252' : '#9E9E9E'} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                    </TouchableOpacity>
                  }
                  style={getInputStyle('password')}
                  containerStyle={styles.inputContainer}
                />
              </View>
            </Animated.View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Link href="/auth/forgot-password">
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Link>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ translateY: buttonAnim }] }}>
              <Button
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
                icon={<LogIn size={18} color="#FFFFFF" />}
              />

            </Animated.View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={styles.registerLinkContainer}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                  <ArrowRight size={16} color="#00BFA5" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
          
          <View style={styles.footer}>
          <Text style={styles.footerText}>
  © 2025 MarketGo. All rights reserved to EL Gharbi Abdellah.
</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  keyboardView: {
    flex: 1,
  },
headerGradient: {
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  paddingBottom: 40,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
  zIndex: 1,
  marginBottom: 40, // corrigé ici
  backgroundColor: '#ffffff',
}
,
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  logoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  logoSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#263238',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#78909C',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Medium',
    color: '#00BFA5',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 12,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#00BFA5',
  },
  demoButton: {
    marginBottom: 24,
    height: 56,
    borderRadius: 12,
    borderColor: '#BFE9E4',
    borderWidth: 1.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00BFA5',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9E9E9E',
  },
});