import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NoRidesAvailableCardProps {
    text?: string;
}

const NoRidesAvailableCard: React.FC<NoRidesAvailableCardProps> = ({text}) => {
  return (
    <View style={styles.card}>
        <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D3D3D3',
    padding: 32,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    fontWeight: '500',
    fontSize: 20,
  }
});

export { NoRidesAvailableCard };