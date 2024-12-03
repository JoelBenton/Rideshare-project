import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, Switch, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LocationModal from "@/src/components/LocationModal";
import { useRouter } from "expo-router";
import { useLocations } from "@/src/hooks/useLocations";
import type { Location } from "@/src/utils/types";
import { ActivityIndicator } from "react-native-paper";
import { FIREBASE_AUTH } from "@/src/config/FirebaseConfig";
import { UserInfo } from "firebase/auth";

const Locations: React.FC = () => {
  const [isGlobal, setIsGlobal] = useState(true);
  const [isAll, setIsAll] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  let currentUser: UserInfo;

  if (!currentUser) {
    currentUser = FIREBASE_AUTH.currentUser!;
  }

  const router = useRouter();

  // Use the `useLocations` hook to fetch locations
  const { data: locations = [], isLoading } = useLocations();

  let locationsData: Location[] = [];

  if (locations.data) {
    locationsData = locations.data as Location[];
  }

  const toggleSwitch = () => setIsGlobal(prev => !prev);
  const toggleSwitch2 = () => setIsAll(prev => !prev);

  // Filter locations based on global and user preferences
  const data = isGlobal
    ? isAll
      ? locationsData.filter(location => location.public)
      : locationsData.filter(location => location.public && location.creatorUid === currentUser.uid.toString())
    : locationsData.filter(location => !location.public);

  const handleLocationPress = (location: Location) => {
    router.push(`/locations/${location.id}`);
  };

  const closeModal = () => {
    setSelectedLocation(null);
    setModalVisible(false);
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleLocationPress(item)}
    >
      <Ionicons
        name="location-sharp"
        size={24}
        color="black"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleAddLocationPress = () => {
    router.push("/locations/create");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={isGlobal ? "earth-outline" : "lock-closed-outline"}
            size={24}
            color="#FFFFFF"
            style={styles.modeIcon}
          />
          <Text style={styles.headerText}>
            {isGlobal ? "Global Locations" : "Private Locations"}
          </Text>
        </View>
        <Switch
          value={isGlobal}
          onValueChange={toggleSwitch}
          thumbColor="#FFFFFF"
          trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
          ios_backgroundColor={"#D8B4FE"}
        />
      </View>
      {isGlobal && (
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={isAll ? "location-outline" : "person-outline"}
              size={24}
              color="#FFFFFF"
              style={styles.modeIcon}
            />
            <Text style={styles.headerText}>
              {isAll ? "All Locations" : "Your Locations"}
            </Text>
          </View>
          <Switch
            value={isAll}
            onValueChange={toggleSwitch2}
            thumbColor="#FFFFFF"
            trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
            ios_backgroundColor={"#D8B4FE"}
          />
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#6A0DAD" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No locations found</Text>}
        />
      )}

      <Pressable style={styles.fab} onPress={handleAddLocationPress}>
        <Ionicons name="add-outline" size={30} color="white" />
      </Pressable>

      <LocationModal visible={isModalVisible} location={selectedLocation} onClose={closeModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  refreshButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: "#6A0DAD",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#6A0DAD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modeIcon: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#E6E6E6",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#374151",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -28 }], // Center the button horizontally
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03A9F4", // Nice blue color for the button
    borderRadius: 30,
    elevation: 8,
  },
});

export default Locations;