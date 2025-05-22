import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { OrderStatus } from '@/context/OrderContext';
import { ChevronDown, Circle, CheckCircle, Truck, Package, XCircle } from 'lucide-react-native';

type OrderStatusSelectorProps = {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
};

const { width: screenWidth } = Dimensions.get('window');

export default function OrderStatusSelector({ currentStatus, onStatusChange }: OrderStatusSelectorProps) {
  const { colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectorLayout, setSelectorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const statuses: { value: OrderStatus; label: string; icon: any }[] = [
    { value: 'pending', label: 'pending', icon: Circle },
    { value: 'processing', label: 'processing', icon: Package },
    { value: 'shipped', label: 'shipped', icon: Truck },
    { value: 'delivered', label: 'delivered', icon: CheckCircle },
    { value: 'cancelled', label: 'cancelled', icon: XCircle }
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#F59E0B'; // Amber
      case 'processing':
        return '#3B82F6'; // Blue
      case 'shipped':
        return '#8B5CF6'; // Purple
      case 'delivered':
        return '#10B981'; // Green
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return colors.gray;
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const handleSelect = (status: OrderStatus) => {
    onStatusChange(status);
    setIsDropdownOpen(false);
  };

  const handleSelectorPress = (event: any) => {
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setSelectorLayout({ x: pageX, y: pageY, width, height });
      setIsDropdownOpen(true);
    });
  };

  const currentStatusInfo = getStatusInfo(currentStatus);
  const StatusIcon = currentStatusInfo.icon;

  // Calculer la position de la dropdown
  const dropdownTop = selectorLayout.y + selectorLayout.height + 5;
  const dropdownRight = screenWidth - (selectorLayout.x + selectorLayout.width);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: getStatusColor(currentStatus) + '15',
            borderColor: getStatusColor(currentStatus) + '40'
          }
        ]}
        onPress={handleSelectorPress}
        activeOpacity={0.8}
      >
        <View style={styles.statusContent}>
          <StatusIcon 
            size={16} 
            color={getStatusColor(currentStatus)}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: getStatusColor(currentStatus) }]}>
            {currentStatusInfo.label}
          </Text>
        </View>
        <ChevronDown 
          size={16} 
          color={getStatusColor(currentStatus)}
          style={[
            styles.chevron,
            isDropdownOpen && styles.chevronRotated
          ]}
        />
      </TouchableOpacity>

      {/* Modal pour la dropdown */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                top: dropdownTop,
                right: dropdownRight,
              }
            ]}
          >
            {statuses.map((status, index) => {
              const OptionIcon = status.icon;
              const isSelected = currentStatus === status.value;
              const isLast = index === statuses.length - 1;
              
              return (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.option,
                    isSelected && { 
                      backgroundColor: getStatusColor(status.value) + '15' 
                    },
                    !isLast && {
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.border + '30'
                    }
                  ]}
                  onPress={() => handleSelect(status.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <OptionIcon 
                      size={16} 
                      color={getStatusColor(status.value)}
                      style={styles.optionIcon}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: getStatusColor(status.value) },
                        isSelected && styles.selectedOptionText
                      ]}
                    >
                      {status.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[
                      styles.selectedIndicator,
                      { backgroundColor: getStatusColor(status.value) }
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    minWidth: 160,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginLeft: 8,
  },
});