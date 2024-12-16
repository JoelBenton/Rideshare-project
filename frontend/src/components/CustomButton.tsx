import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { defaultStyles } from '@/src/constants/themes';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  isLoading = false,
  disabled = false,
}) => {
  const buttonDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        buttonDisabled && styles.disabledButton,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={buttonDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={defaultStyles.secondaryColor} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.primaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
  },
  buttonText: {
    color: defaultStyles.secondaryColor,
    fontFamily: defaultStyles.fontFamily,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
});

export default CustomButton;