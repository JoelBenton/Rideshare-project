import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import type { Location } from '../utils/types';

interface DropdownComponentProps {
  data: { label: string; value: Location }[];
  placeholder?: string;
  searchPlaceholder?: string;
  onValueChange: (value: Location | null) => void;
  selectedValue?: Location | null; // New prop to allow pre-selected value
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  data,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  onValueChange,
  selectedValue = null, // Default to null if not provided
}) => {
  const [value, setValue] = useState<{ label: string; value: Location } | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  // Update the local state if selectedValue prop changes
  useEffect(() => {
    if (selectedValue) {
      setValue({ label: selectedValue.name, value: selectedValue });
    } else {
      setValue(null); // Reset if selectedValue is null
    }
  }, [selectedValue]);

  const handleClear = () => {
    setValue(null);
    onValueChange(null);
  };

  const handleValueChange = (item: { label: string; value: Location }) => {
    setValue(item);  
    setIsFocus(false);
    onValueChange(item.value);
  };

  return (
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : '...'}
          searchPlaceholder={searchPlaceholder}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleValueChange}
          renderLeftIcon={() => (
            <Ionicons
              style={styles.icon}
              name="location"
              size={20}
            />
          )}
        />
        {value && (
          <TouchableOpacity onPress={handleClear} style={styles.clearIcon}>
            <AntDesign name="closecircle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF', // Replace with your default theme color
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdownWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  clearIcon: {
    position: 'absolute',
    right: 40,
  },
});