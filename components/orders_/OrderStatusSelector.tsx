import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { OrderStatus } from '@/context/OrderContext';
import { ChevronDown } from 'lucide-react-native';

type OrderStatusSelectorProps = {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
};

export default function OrderStatusSelector({ currentStatus, onStatusChange }: OrderStatusSelectorProps) {
  const { colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const statuses: OrderStatus[] = [
    'pending', 
    'processing', 
    'shipped', 
    'delivered', 
    'cancelled'
  ];
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'processing':
        return colors.primary;
      case 'shipped':
        return colors.accent;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray;
    }
  };
  
  const handleSelect = (status: OrderStatus) => {
    onStatusChange(status);
    setIsDropdownOpen(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          { 
            backgroundColor: getStatusColor(currentStatus) + '20', 
            borderColor: getStatusColor(currentStatus) 
          }
        ]}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={[styles.statusText, { color: getStatusColor(currentStatus) }]}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </Text>
        <ChevronDown size={16} color={getStatusColor(currentStatus)} />
      </TouchableOpacity>
      
      {isDropdownOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.option,
                currentStatus === status && { backgroundColor: getStatusColor(status) + '20' }
              ]}
              onPress={() => handleSelect(status)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  { color: getStatusColor(status) }
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 40,
    width: 140,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});