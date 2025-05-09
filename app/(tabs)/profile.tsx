import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ChangePasswordModal } from '@/components/profile/ChangePasswordModal';
import { User, Mail, Lock, LogOut, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
     Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          logout(); // appelle ta fonction logout ici
        },
        style: 'destructive',
      },
    ],
    { cancelable: true } // optionnel, permet de fermer l'alerte en cliquant en dehors
  );
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => setEditProfileVisible(true)}
          >
            <Text style={styles.editProfileButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setEditProfileVisible(true)}
          >
            <View style={styles.menuIconContainer}>
              <User size={20} color="#00BFA5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemText}>Personal Information</Text>
              <ChevronRight size={20} color="#B0BEC5" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setChangePasswordVisible(true)}
          >
            <View style={styles.menuIconContainer}>
              <Lock size={20} color="#00BFA5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemText}>Change Password</Text>
              <ChevronRight size={20} color="#B0BEC5" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <CreditCard size={20} color="#00BFA5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemText}>Payment Methods</Text>
              <ChevronRight size={20} color="#B0BEC5" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Bell size={20} color="#00BFA5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: "#CFD8DC", true: "#80CBC4" }}
                thumbColor={notifications ? "#00BFA5" : "#F5F5F5"}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color="#00BFA5" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemText}>Help Center</Text>
              <ChevronRight size={20} color="#B0BEC5" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut size={20} color="#F44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        user={user}
      />
      
      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#263238',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#263238',
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
  },
  editProfileButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#00BFA5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#263238',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#F44336',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B0BEC5',
    textAlign: 'center',
    marginBottom: 32,
  },
});