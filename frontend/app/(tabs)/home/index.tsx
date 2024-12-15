import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RideCard } from '../../../src/components/rideCard';
import { NoRidesAvailableCard } from '../../../src/components/NoRidesAvailableCard';
import CustomButton from '@/src/components/CustomButton';
import { router } from 'expo-router';
import { useUpcomingTrips } from '@/src/hooks/useTrips';
import { ActivityIndicator } from 'react-native-paper';

const HomePage: React.FC = () => {
  const { data: Trips = [], isLoading } = useUpcomingTrips();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.loadingText}>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Created Trips Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Created Trips</Text>
          {Trips ? (Trips.data.length > 0 ? (
            <RideCard key={Trips.data[0].id} data={Trips.data[0]} />
          ) : (
            <NoRidesAvailableCard text="No Trips Created" />
          )) : (
            <NoRidesAvailableCard text="No Trips Created" />
          )}
          <CustomButton
            title="See More"
            buttonStyle={styles.smallButton}
            onPress={() => {}}
          />
        </View>

        {/* Requested/Joined Trips Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Requested / Joined Trips</Text>
          { 0 ? (
            <RideCard key={Trips.data[0].id} data={Trips.data[0]} />
          ) : (
            <NoRidesAvailableCard text="No Trips Requested / Joined" />
          )}
          <CustomButton
            title="See More"
            buttonStyle={styles.smallButton}
            onPress={() => {}}
          />
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <CustomButton
            title="Create Trip"
            buttonStyle={styles.halfButton}
            onPress={() => router.push('/(tabs)/(trips)/create_locations')}
          />
          <CustomButton
            title="Search Trips"
            buttonStyle={styles.halfButton}
            onPress={() => {}}
          />
        </View>
        <CustomButton
          title="View All Active Trips"
          buttonStyle={styles.fullButton}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 5,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 15,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6a0dad',
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
  spacer: {
    flexGrow: 1, // Pushes the buttons to the bottom
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10, // Adds spacing between the button group and the full-width button
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
    marginBottom: 10, // Adds spacing from the bottom of the screen
    elevation: 3,
    shadowColor: '#373737',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
});

export default HomePage;