import { Platform } from 'react-native';

export const defaultStyles = {
  fontFamily: Platform.OS === 'ios' ? 'Nunito' : 'Roboto',
  primaryColor: '#6A0DAD',
  secondaryColor: '#FFFFFF',
  // Add more default styles as needed
};