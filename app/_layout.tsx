import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import { OrdersProvider } from '@/hooks/useOrders';
import { ProductProvider } from '@/context/ProductContext';
import { StatsProvider } from '@/context/StatsContext';
import { OrderProvider } from '@/context/OrderContext';
import { AuthProviders } from '@/context/AuthContext';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/firebase';
import { FirebaseErrorHandler } from '@/utils/errorHandling';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  // Initialize Firebase
  useEffect(() => {
    try {
      if (getApps().length === 0) {
        initializeApp(firebaseConfig);
      }
      setFirebaseInitialized(true);
    } catch (error) {
      console.error('Firebase initialization error:', FirebaseErrorHandler.handleError(error));
    }
  }, []);

  // Hide splash screen once fonts are loaded and Firebase is initialized
  useEffect(() => {
    if ((fontsLoaded || fontError) && firebaseInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, firebaseInitialized]);

  // Return null to keep splash screen visible while fonts load and Firebase initializes
  if (!fontsLoaded && !fontError || !firebaseInitialized) {
    return null;
  }

  return (
    <AuthProvider>
      <ProductProvider>
        <AuthProviders>
          <OrderProvider>
            <StatsProvider>
              <CartProvider>
                <OrdersProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    {/* Authentication flow */}
                    <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                    
                    {/* Main customer tab navigator */}
                    <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                    
                    {/* Admin/Seller tab navigator */}
                    <Stack.Screen name="(tabs_)" options={{ animation: 'fade' }} />
                    
                    {/* Product details modal */}
                    <Stack.Screen name="(product)" options={{ presentation: 'card' }} />
                    
                    {/* Standalone routes */}
                    <Stack.Screen name="products_" options={{ headerShown: false }} />
                    <Stack.Screen name="orders" options={{ headerShown: false }} />
                    
                    {/* Error handling */}
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </OrdersProvider>
              </CartProvider>
            </StatsProvider>
          </OrderProvider>
        </AuthProviders>
      </ProductProvider>
    </AuthProvider>
  );
}