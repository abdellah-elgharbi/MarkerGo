import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { MapPin, CreditCard, Truck } from 'lucide-react-native';

export default function StoreSettings() {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [storeAddress, setStoreAddress] = useState('123 Market Street, San Francisco, CA 94103');
  const [paymentMethods, setPaymentMethods] = useState('Visa, Mastercard, PayPal');
  const [shippingOptions, setShippingOptions] = useState('Standard Shipping, Express Shipping');
  
  const handleSave = () => {
    // Save store settings in a real app
    setIsEditing(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Store Settings</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingHeader}>
          <MapPin size={20} color={colors.primary} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: colors.text }]}>Store Address</Text>
        </View>
        
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={storeAddress}
            onChangeText={setStoreAddress}
            multiline
          />
        ) : (
          <Text style={[styles.settingValue, { color: colors.textLight }]}>
            {storeAddress}
          </Text>
        )}
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingHeader}>
          <CreditCard size={20} color={colors.primary} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: colors.text }]}>Payment Methods</Text>
        </View>
        
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={paymentMethods}
            onChangeText={setPaymentMethods}
          />
        ) : (
          <Text style={[styles.settingValue, { color: colors.textLight }]}>
            {paymentMethods}
          </Text>
        )}
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingHeader}>
          <Truck size={20} color={colors.primary} style={styles.settingIcon} />
          <Text style={[styles.settingLabel, { color: colors.text }]}>Shipping Options</Text>
        </View>
        
        {isEditing ? (
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={shippingOptions}
            onChangeText={setShippingOptions}
          />
        ) : (
          <Text style={[styles.settingValue, { color: colors.textLight }]}>
            {shippingOptions}
          </Text>
        )}
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  settingRow: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  settingValue: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
});