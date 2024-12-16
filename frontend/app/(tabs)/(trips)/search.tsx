import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/src/components/CustomButton';
import { RideCard } from '@/src/components/rideCard';
import { useUpcomingTrips } from '@/src/hooks/useTrips';
import { NoRidesAvailableCard } from '@/src/components/NoRidesAvailableCard';
import { Trips } from '@/src/utils/types';

const SearchTripsPage: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tripName, setTripName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // State to toggle filters

  const { data: UpcomingTripsData = [], isLoading: isLoadingUpcomingTrips } = useUpcomingTrips();

  let UpcomingTrips: Trips[] = [];

  if (UpcomingTripsData) {
    UpcomingTrips = UpcomingTripsData.data as Trips[];
  }

  useEffect(() => {
    if (isLoadingUpcomingTrips) {
      setSearchResults([]);
      setIsLoading(false);
    } else {
      setSearchResults(UpcomingTrips || []);
    }
  }, [isLoadingUpcomingTrips]);

  // Filter trips by origin, destination, and trip name
  const handleSearch = () => {
    setIsLoading(true);

    console.log(UpcomingTrips);

    if (!UpcomingTrips) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const results = UpcomingTrips.filter((trip) => {
      const originMatch = origin
        ? trip.origin.address.toLowerCase().includes(origin.toLowerCase())
        : true;

      const destinationMatch = destination
        ? trip.destination.address.toLowerCase().includes(destination.toLowerCase())
        : true;

      const nameMatch = tripName
        ? trip.trip_name.toLowerCase().includes(tripName.toLowerCase())
        : true;

      return originMatch && destinationMatch && nameMatch;
    });

    setSearchResults(results);
    setIsLoading(false);
  };

  // Clear filters and show all trips
  const handleClearFilters = () => {
    setOrigin('');
    setDestination('');
    setTripName('');
    setSearchResults(UpcomingTrips || []); // Show all trips when filters are cleared
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Search Trips</Text>

      <CustomButton
        title={showFilters ? 'Hide Filters' : 'Show Filters'}
        buttonStyle={styles.toggleButton}
        onPress={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.input}
            placeholder="Trip Name"
            value={tripName}
            onChangeText={setTripName}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Origin Address"
            value={origin}
            onChangeText={setOrigin}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Destination Address"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#999"
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="Search" buttonStyle={styles.filterButton} onPress={handleSearch} />
            <CustomButton title="Clear Filters" buttonStyle={styles.filterButton} onPress={handleClearFilters} />
          </View>
        </View>
      )}

      {/* Search Results Section */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Search Results</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isLoading || isLoadingUpcomingTrips ? (
            <Text>Loading...</Text>
          ) : searchResults.length > 0 ? (
            searchResults.map((trip) => <RideCard key={trip.id} data={trip} />)
          ) : (
            <NoRidesAvailableCard />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4B0082',
    marginVertical: 20,
    textAlign: 'center',
  },
  toggleButton: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6A0DAD',
  },
  filtersContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#4B0082',
    width: '48%',
    borderRadius: 10,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B0082',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default SearchTripsPage;