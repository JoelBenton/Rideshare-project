import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { defaultStyles } from '@/src/constants/themes';
import { useFonts } from 'expo-font'

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, buttonStyle, textStyle }) => {

  const [fontsLoaded, fontError] = useFonts({
    'InknutAntiqua_600SemiBold': require('@/assets/Fonts/InknutAntiqua-SemiBold.ttf')
  })

  if (fontError) {
    console.error(fontError)
  }

  if (!fontsLoaded) {
    return <ActivityIndicator />
  }
 
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.primaryColor,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45
  },
  buttonText: {
    color: defaultStyles.secondaryColor,
    fontFamily: defaultStyles.fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;