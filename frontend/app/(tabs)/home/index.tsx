import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RideCard } from '../../../src/components/rideCard';
import { NoRidesAvailableCard } from '../../../src/components/NoRidesAvailableCard';
import CustomButton from '@/src/components/CustomButton';

const HomePage: React.FC = () => {
  const testData = {
    startName: 'HX Reef',
    startTown: 'Company',
    date: new Date(),
    endName: 'Asda',
    endTown: 'Folkestone',
    usedCapacity: 3,
    totalCapacity: 4
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Created Trips Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Created Trips</Text>
        <NoRidesAvailableCard text="No Trips Created" />
        <CustomButton title="See More" buttonStyle={styles.smallButton} />
      </View>

      {/* Requested/Joined Trips Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Requested / Joined Trips</Text>
        <RideCard cardStyle={styles.cardStyle} showButton={false} data={testData} />
        <CustomButton title="See More" buttonStyle={styles.smallButton} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <CustomButton title="Create Trip" buttonStyle={styles.halfButton} />
        <CustomButton title="Search Trips" buttonStyle={styles.halfButton} />
      </View>
      <CustomButton title="View all active trips" buttonStyle={styles.fullButton} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    width: '100%',
    backgroundColor: '#fffffe',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 15,
    alignSelf: 'center'
  },
  cardStyle: {
    backgroundColor: '#ff7777',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  smallButton: {
    backgroundColor: '#6a0dad',
    width: '50%',
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  halfButton: {
    backgroundColor: '#6a0dad',
    width: '48%',
    borderRadius: 8,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  fullButton: {
    backgroundColor: '#6a0dad',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

export default HomePage;