import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, Switch, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LocationModal from "@/src/components/LocationModal";
import { useRouter } from "expo-router";
import { getLocations } from "@/src/hooks/useLocations";
import type { Location } from "@/src/utils/types";
import { ActivityIndicator } from "react-native-paper";
import { FIREBASE_AUTH } from "@/src/config/FirebaseConfig";
import { UserInfo } from "firebase/auth";

const globalLocations = [
  { id: "1", name: "Ashford International Station", latitude: 51.1435, longitude: 0.8762 },
  { id: "2", name: "Hythe Beach", latitude: 51.0719, longitude: 1.0857 },
  { id: "3", name: "Canterbury Cathedral", latitude: 51.2798, longitude: 1.0836 },
];

const privateLocations = [
  { id: "1", name: "My Favorite Café", latitude: 51.1106, longitude: 1.0843 },
  { id: "2", name: "Hidden Hiking Spot", latitude: 51.0884, longitude: 1.0725 },
];

const Locations: React.FC = () => {
  const [isGlobal, setIsGlobal] = useState(true);
  const [isAll, setIsAll] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  let currentUser: UserInfo;

  if (!currentUser) {
    currentUser = FIREBASE_AUTH.currentUser;
  }

  const router = useRouter();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const { success, data } = await getLocations();
    if (success) {
      setLocations(data);
    } else {
      setLocations([]);
    }
    setLoading(false);
  };

  const toggleSwitch = async () => setIsGlobal((prev) => !prev);

  const toggleSwitch2 = () => setIsAll((prev) => !prev);

  const data = isGlobal ? ( isAll ? locations.filter((location) => location.public) : locations.filter((location) => location.public && location.creatorUid == currentUser.uid.toString() )): locations.filter((location) => !location.public);

  const handleLocationPress = (location: Location) => {
    router.push(`/locations/${location.id}`);
  };

  const closeModal = () => {
    setSelectedLocation(null);
    setModalVisible(false);
  };

  const renderLocationItem = ({ item }) => (
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
        <TouchableOpacity onPress={fetchLocations} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        <Switch
          value={isGlobal}
          onValueChange={toggleSwitch}
          thumbColor="#FFFFFF"
          trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
          ios_backgroundColor={"#D8B4FE"}
        />
        
      </View>
      { isGlobal && (
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
      )
        }
      { loading ? (
        <ActivityIndicator size={"large"} color={"#6A0DAD"} style={{ marginTop: 20 }} />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderLocationItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>No locations found</Text>} /
          >
          <LocationModal
            visible={isModalVisible}
            location={selectedLocation}
            onClose={closeModal} 
          />
        </>
      )}
      
      <Pressable style={styles.fab} onPress={handleAddLocationPress}>
        <Ionicons name="add-outline" size={30} color="white" />
      </Pressable>
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