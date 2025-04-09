import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAllTripsForUser } from "@/src/hooks/useTrips"; // Replace with your actual data-fetching hook
import { AuthContext } from "@/src/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NoRidesAvailableCard } from "@/src/components/NoRidesAvailableCard";
import { RideCard } from "@/src/components/rideCard";
import { sortTripsByDate } from "@/src/utils/sort";
import { router } from "expo-router";

const RideHistory: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { data: trips = { data: [] }, isLoading } = useAllTripsForUser(
    user?.uid
  ); // Fetch trips via a custom hook or API

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Results Section */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Ride History</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : trips.data.length > 0 ? (
            sortTripsByDate(trips.data).map((trip) => (
              <RideCard
                key={trip.id}
                data={trip}
                onPress={() => router.push(`/(tabs)/(trips)/${trip.id}`)}
              />
            ))
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
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4B0082",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default RideHistory;
