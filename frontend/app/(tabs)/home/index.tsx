import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/src/components/CustomButton';
import { RideCard } from '@/src/components/rideCard';
import { useUpcomingTripsForUser } from '@/src/hooks/useTrips';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NoRidesAvailableCard } from '@/src/components/NoRidesAvailableCard';
import { Trips } from '@/src/utils/types';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext)
  if (!user) {
    router.replace('/(auth)/login');
  }
  const { data: Trips = [], isLoading } = useUpcomingTripsForUser(user?.uid);

  let TripsData: Trips[] = [];

  if (Trips) {
    TripsData = Trips.data as Trips[];
  }

  const getClosestTrip = () => {

    // Map trips to `Date` objects for comparison
    const upcomingTrips = getUpcomingTrips()
      .map((trip) => {
        const [day, month, year] = trip.date_of_trip.split('-').map(Number);
        const [hour, minute] = trip.time_of_trip.split(':').map(Number);

        // Create a Date object for the trip
        const tripDate = new Date(year, month - 1, day, hour, minute);

        return {
          ...trip,
          tripDate,
        };
      });

    if (upcomingTrips.length === 0) {
      return null;
    }
    const closestTrip = (upcomingTrips).reduce((prev, current) => {
      return prev.tripDate < current.tripDate ? prev : current;
    });

    // Return the closest trip
    return closestTrip;
  };

  const getUpcomingTrips = () => {
    if (!TripsData) {
      return [];
    }

    return TripsData.filter((trip) => trip.driver.id === user?.uid || trip.passengers.some((passenger) => passenger.driver.id === user?.uid && trip.passengers.some((passenger) => passenger.status === 'confirmed')));
  }

  const getRequestedTrips = () => {
    if (!TripsData) {
      return [];
    }

    return TripsData.filter((trip) => trip.passengers.some((passenger) => passenger.driver.id === user?.uid && !trip.passengers.some((passenger) => passenger.status === 'confirmed')));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#6a0dad', '#4b0082', '#28175a']} // Customizable gradient colors
        style={styles.header}
      >
        <Text style={styles.headerText}>Welcome to RideShare</Text>
        <Text style={styles.headerSubText}>Plan, Join, and Enjoy Your Trips</Text>
      </LinearGradient>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <CustomButton
          title="Create Trip"
          buttonStyle={styles.actionButton}
          onPress={() => router.push('/(tabs)/(trips)/create_locations')}
        />
        <CustomButton
          title="Search Trips"
          buttonStyle={styles.actionButton}
          onPress={() => router.push('/(tabs)/(trips)/search')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Upcoming Trips Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B0082" />
              <Text style={styles.loadingText}>Loading trips...</Text>
            </View>
          ) : getClosestTrip() ? (
            <>
              <RideCard
                key={getClosestTrip().id}
                data={getClosestTrip()}
                onPress={() => router.push(`/(tabs)/(trips)/${getClosestTrip().id}`)}
              />
              {getUpcomingTrips().length > 1 && (
                <CustomButton
                  title="View All Trips"
                  buttonStyle={styles.viewAllButton}
                  onPress={() => router.push(`/(tabs)/(trips)/upcoming`)}
                />
              )}
            </>
          ) : (
            <NoRidesAvailableCard />
          )}
        </View>

        {/* Requested Trips Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Requested Trips</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B0082" />
              <Text style={styles.loadingText}>Loading requested trips...</Text>
            </View>
          ) : getRequestedTrips().length > 0 ? (
            getRequestedTrips().map((trip) => (
              <RideCard key={trip.id} data={trip} onPress={() => router.push(`/(tabs)/(trips)/${trip.id}`)}/>
            ))
          ) : (
            <Text style={styles.noTripsText}>No requested trips found.</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#dcdcdc',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: -30, // Overlap the header slightly
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4B0082',
    borderRadius: 30,
    paddingVertical: 15,
    width: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4B0082',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4B0082',
  },
  viewAllButton: {
    backgroundColor: '#4B0082',
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '50%',
  },
  noTripsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomePage;