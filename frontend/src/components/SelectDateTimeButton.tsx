import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
type SelectDateTimeButtonProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  value: string;
  onPress: () => void;
};

const SelectDateTimeButton: React.FC<SelectDateTimeButtonProps> = ({ label, iconName, value, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name={iconName} size={24} color="black" style={styles.icon} />
        <Text style={styles.valueText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDateTimeButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '45%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 15,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
  },
});