import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ 
  visible, 
  onClose,
}: ChangePasswordModalProps) {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await changePassword(currentPassword, newPassword);
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } catch (error) {
        console.error('Failed to change password:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#263238" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                error={errors.currentPassword}
                placeholder="Enter your current password"
                rightIcon={
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                  </TouchableOpacity>
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                error={errors.newPassword}
                placeholder="Enter your new password"
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                  </TouchableOpacity>
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                placeholder="Confirm your new password"
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} color="#9E9E9E" /> : <Eye size={20} color="#9E9E9E" />}
                  </TouchableOpacity>
                }
              />
            </View>

            <Text style={styles.securityNote}>
              Password must be at least 6 characters long and should include a mix of letters, numbers, and special characters for better security.
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Update Password"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#263238',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  securityNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
});