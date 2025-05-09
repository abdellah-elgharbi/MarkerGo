import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileActions from '@/components/profile/ProfileActions';
import StoreSettings from '@/components/profile/StoreSettings';

export default function ProfileScreen() {
  const { user, updateUserProfile, logout } = useAuth();

  const handleUpdateProfile = (updatedData: any) => {
    updateUserProfile(updatedData);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Profile" />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileForm 
          user={user} 
          onSave={handleUpdateProfile} 
        />
        
        <StoreSettings />
        
        <ProfileActions onLogout={logout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});