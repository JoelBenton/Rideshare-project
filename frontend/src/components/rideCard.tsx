import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trips } from '../utils/types';

interface RideCardProps {
  data: Trips;
  onPress?: () => void; // Optional callback for when the card is pressed
}

const RideCard: React.FC<RideCardProps> = ({ data, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
      {/* Top Row: Trip Information */}
      <View style={styles.row}>
        <Ionicons name="car-outline" size={20} color="#007BFF" />
        <Text style={styles.tripName}>{data.trip_name}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Locations */}
      <View style={styles.row}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>From:</Text>
          <Text style={styles.locationText} numberOfLines={5} ellipsizeMode="tail">{data.origin.address}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#333" />
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>To:</Text>
          <Text style={styles.locationText} numberOfLines={5} ellipsizeMode="tail">{data.destination.address}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Date, Time, and Seats */}
      <View style={styles.row}>
        <View style={styles.infoSection}>
          <Ionicons name="calendar-outline" size={16} color="#333" />
          <Text style={styles.infoText}>{data.date_of_trip}</Text>
        </View>
        <View style={styles.infoSection}>
          <Ionicons name="time-outline" size={16} color="#333" />
          <Text style={styles.infoText}>{data.time_of_trip}</Text>
        </View>
        <View style={styles.infoSection}>
          <Ionicons name="person-outline" size={16} color="#333" />
          <Text style={styles.infoText}>
            {data.vehicle.seats_occupied}/{data.vehicle.seats_available}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  locationContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
});

export { RideCard };