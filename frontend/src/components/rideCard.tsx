import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface CustomRideCardProps {
    cardStyle?: StyleProp<ViewStyle>;
    showButton?: boolean
    data: {
        startName: string,
        startTown: string,
        date: Date,
        endName: string,
        endTown: string,
        usedCapacity: Int32,
        totalCapacity: Int32
    }
  }

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const RideCard: React.FC<CustomRideCardProps> = ({cardStyle, showButton = true, data}) => {
  return (
    <View style={[styles.card, cardStyle]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <Text style={styles.locationText}>{data.startName}</Text>
        <Text style={styles.subText}>{data.startTown}</Text>
        <Text style={styles.dateText}>{formatDate(data.date)}</Text>
      </View>

      {/* Center Arrow */}
      <Ionicons name="arrow-forward" size={24} color="black" />

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Text style={styles.locationText}>{data.endName}</Text>
        <Text style={styles.subText}>{data.endTown}</Text>
        <View style={styles.passengerInfo}>
          <Ionicons name="person-outline" size={16} color="black" />
          <Text style={styles.passengerText}> {data.usedCapacity}/{data.totalCapacity}</Text>
        </View>
      </View>

      {/* Right Arrow */}
      <View style={ !showButton ? {display: 'none'} : undefined}>
        <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'space-between',
    width: '90%',
    margin: 10,
  },
  leftSection: {
    alignItems: 'flex-start',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 3,
  },
  subText: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 3,
  },
  dateText: {
    fontSize: 12,
    padding: 3,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  passengerText: {
    fontSize: 12,
    color: 'black',
  },
});

export { RideCard };