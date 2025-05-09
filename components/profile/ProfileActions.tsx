import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LogOut, Moon, Bell, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';

type ProfileActionsProps = {
  onLogout: () => void;
};

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
      
      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
            <Bell size={20} color={colors.primaryLight} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
        </View>
        <Switch 
          value={true}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={'#FFFFFF'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
            <Moon size={20} color={colors.accent} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
        </View>
        <Switch 
          value={isDark}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={'#FFFFFF'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
            <Shield size={20} color={colors.success} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>Privacy & Security</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.gray }]}>›</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
            <HelpCircle size={20} color={colors.warning} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.gray }]}>›</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { borderColor: colors.error }]}
        onPress={onLogout}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  chevron: {
    fontSize: 24,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});