import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { X, CreditCard, Calendar, ChevronsUpDown } from 'lucide-react-native';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  totalAmount: number;
  loading: boolean;
}

export function PaymentModal({ 
  visible, 
  onClose, 
  onPaymentSuccess,
  totalAmount,
  loading
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    };

    // Card number validation
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      isValid = false;
    }

    // Card holder validation
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
      isValid = false;
    }

    // Expiry date validation
    if (!expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Use format MM/YY';
      isValid = false;
    }

    // CVV validation
    if (!cvv.trim()) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onPaymentSuccess();
    }
  };

  const formatCardNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
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
            <Text style={styles.modalTitle}>Payment Details</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#263238" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Card Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={[styles.inputContainer, errors.cardNumber && styles.inputError]}>
                  <CreditCard size={20} color="#9E9E9E" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="number-pad"
                    maxLength={19}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  />
                </View>
                {errors.cardNumber ? (
                  <Text style={styles.errorText}>{errors.cardNumber}</Text>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Holder</Text>
                <View style={[styles.inputContainer, errors.cardHolder && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                  />
                </View>
                {errors.cardHolder ? (
                  <Text style={styles.errorText}>{errors.cardHolder}</Text>
                ) : null}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={[styles.inputContainer, errors.expiryDate && styles.inputError]}>
                    <Calendar size={20} color="#9E9E9E" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      keyboardType="number-pad"
                      maxLength={5}
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    />
                  </View>
                  {errors.expiryDate ? (
                    <Text style={styles.errorText}>{errors.expiryDate}</Text>
                  ) : null}
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={[styles.inputContainer, errors.cvv && styles.inputError]}>
                    <ChevronsUpDown size={20} color="#9E9E9E" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      keyboardType="number-pad"
                      maxLength={4}
                      value={cvv}
                      onChangeText={setCvv}
                      secureTextEntry
                    />
                  </View>
                  {errors.cvv ? (
                    <Text style={styles.errorText}>{errors.cvv}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={`Pay $${totalAmount.toFixed(2)}`}
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
  paymentSection: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#263238',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#546E7A',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#F44336',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#263238',
  },
  inputIcon: {
    marginRight: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  summarySection: {
    padding: 16,
    backgroundColor: '#F5F7FA',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C',
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#263238',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#ECEFF1',
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#263238',
  },
  totalValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#00BFA5',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
});