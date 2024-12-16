import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NoRidesAvailableCardProps {
  text?: string;
}

const NoRidesAvailableCard: React.FC<NoRidesAvailableCardProps> = ({ text = "No trips available." }) => {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <Ionicons name="car-outline" size={48} color="#A0A0A0" style={styles.icon} />

      {/* Message */}
      <Text style={styles.title}>{text}</Text>
      <Text style={styles.subtitle}>Check back later or create a new trip to get started!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F9F9',
    padding: 24,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export { NoRidesAvailableCard };