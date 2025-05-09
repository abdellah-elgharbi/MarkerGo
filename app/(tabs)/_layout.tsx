import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, Search, ShoppingCart, ClipboardList, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const { items } = useCart();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00BFA5',
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarStyle: {
          borderTopColor: '#ECEFF1',
          height: 60,
          paddingTop: 5,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <>
              <ShoppingCart size={size} color={color} />
              {items.length > 0 && (
                <Badge value={items.length} style={{ position: 'absolute', top: -6, right: -10 }} />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}