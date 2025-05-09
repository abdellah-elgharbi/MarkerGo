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
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
}

export function EditProfileModal({ 
  visible, 
  onClose,
  user,
}: EditProfileModalProps) {
  const { updateUserProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
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

    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await updateUserProfile({
          name,
          email,
          phone,
          address,
        });
        onClose();
      } catch (error) {
        console.error('Failed to update profile:', error);
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
            <Text style={styles.modalTitle}>Edit Profile</Text>
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
                label="Full Name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Phone Number (optional)"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Address (optional)"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                style={styles.multilineInput}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Save Changes"
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
});