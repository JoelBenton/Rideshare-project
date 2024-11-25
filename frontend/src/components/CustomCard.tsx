import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { defaultStyles } from '../constants/themes';

interface CustomCardProps {
  title?: string;
  primaryValue: string;
  onPrimaryChange: (text: string) => void;
  primaryPlaceholder: string;
  secureTextEntry?: boolean;
  secondaryValue?: string;
  onSecondaryChange?: (text: string) => void;
  secondaryPlaceholder?: string;
  showSecureTextEntryToggle?: boolean
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  primaryValue,
  onPrimaryChange,
  primaryPlaceholder,
  secureTextEntry = false,
  secondaryValue,
  onSecondaryChange,
  secondaryPlaceholder,
  showSecureTextEntryToggle = false,
  containerStyle,
  titleStyle,
  inputStyle,
}) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry)

    const toggleSecureText = () => {
        setIsSecure(!isSecure)
    };

    return (
        <View style={[styles.card, containerStyle]}>
          {title !== undefined && (
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.primaryText, inputStyle]}
              value={primaryValue}
              onChangeText={onPrimaryChange}
              placeholder={primaryPlaceholder}
              secureTextEntry={isSecure}
            />
            {showSecureTextEntryToggle && (
              <TouchableOpacity onPress={toggleSecureText} style={styles.toggleButton}>
                <Text style={styles.toggleButtonText}>
                  {isSecure ? 'Show' : 'Hide'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {secondaryValue !== undefined && onSecondaryChange && (
            <TextInput
              style={styles.secondaryText}
              value={secondaryValue}
              onChangeText={onSecondaryChange}
              placeholder={secondaryPlaceholder}
            />
          )}
        </View>
      );
};

const styles = StyleSheet.create({
    card: {
      padding: 16,
      borderWidth: 1,
      borderColor: '#AEAEB2',
      borderRadius: 12,
      backgroundColor: defaultStyles.secondaryColor,
      // marginBottom: 12,
      marginTop: 12,
    },
    title: {
      color: defaultStyles.primaryColor,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    primaryText: {
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    toggleButton: {
      marginLeft: 8,
    },
    toggleButtonText: {
      color: defaultStyles.primaryColor,
      fontSize: 16,
    },
    secondaryText: {
      color: '#AEAEB2',
      fontSize: 18,
    },
  });

export default CustomCard;