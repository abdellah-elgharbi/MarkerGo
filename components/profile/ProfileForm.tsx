import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { User } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus } from 'lucide-react-native';

type ProfileFormProps = {
  user: User | null;
  onSave: (userData: any) => void;
};

export default function ProfileForm({ user, onSave }: ProfileFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    onSave({
      name,
      email,
      phone,
      storeName,
      avatar
    });
    setIsEditing(false);
  };
  
  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      if (source === 'camera') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        
        if (!result.canceled) {
          setAvatar(result.assets[0].uri);
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        
        if (!result.canceled) {
          setAvatar(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error picking an image:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
      
      <View style={styles.avatarContainer}>
        <Image 
          source={{ 
            uri: avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
          }} 
          style={styles.avatar}
        />
        
        {isEditing && (
          <View style={styles.avatarActions}>
            <TouchableOpacity 
              style={[styles.avatarButton, { backgroundColor: colors.primary }]}
              onPress={() => pickImage('camera')}
            >
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.avatarButton, { backgroundColor: colors.primary }]}
              onPress={() => pickImage('gallery')}
            >
              <ImagePlus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textLight }]}>Full Name</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={[styles.value, { color: colors.text }]}>{name}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textLight }]}>Email</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={[styles.value, { color: colors.text }]}>{email}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textLight }]}>Phone</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={[styles.value, { color: colors.text }]}>{phone || 'Not set'}</Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.textLight }]}>Store Name</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={storeName}
            onChangeText={setStoreName}
          />
        ) : (
          <Text style={[styles.value, { color: colors.text }]}>{storeName}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          { 
            backgroundColor: isEditing ? colors.primary : colors.background,
            borderColor: isEditing ? colors.primary : colors.border
          }
        ]}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text 
          style={[
            styles.buttonText,
            { color: isEditing ? '#FFFFFF' : colors.text }
          ]}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    paddingVertical: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});