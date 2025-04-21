import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Switch, Alert } from "react-native";
import { defaultStyles } from "@/src/constants/themes";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "@/src/components/DropdownComponent";
import { useLocations } from "@/src/hooks/useLocations";
import type { Location } from "@/src/utils/types";
import LocationSearchModal from "@/src/components/LocationSearchModal";
import CustomButton from "@/src/components/CustomButton";
import MapWithRouteModal from "@/src/components/MapWithRouteModal";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, Dispatch } from "@/src/rematch/store";

const CreateLocations = () => {
  const { startLocation, endLocation, startModalLocation, endModalLocation } =
    useSelector((state: RootState) => state.locations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapWithRouteModalVisible, setIsMapWithRouteModalVisible] =
    useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const dispatch = useDispatch<Dispatch>();

  const { data: locations = [] } = useLocations();

  const locationsData = (locations.data || []) as Location[];

  const dropdownData = locationsData.map((location) => ({
    label: location.name,
    value: location,
  }));

  const currentLocation = isEnd ? endLocation : startLocation;
  const currentModalLocation = isEnd ? endModalLocation : startModalLocation;

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const setCurrentLocation = (selectedLocation: Location) => {
    if (isEnd) {
      dispatch.locations.setEndLocation(selectedLocation, {});
    } else {
      dispatch.locations.setStartLocation(selectedLocation, {});
    }
  };

  const handleModalSelected = (selectedLocation: {
    lat: string;
    lng: string;
    address: string;
  }) => {
    if (isEnd) {
      dispatch.locations.setEndModalLocation(
        {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          address: selectedLocation.address,
        },
        {}
      );
    } else {
      dispatch.locations.setStartModalLocation(
        {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          address: selectedLocation.address,
        },
        {}
      );
    }
  };

  const toggleSwitch = () => {
    setIsEnd(!isEnd);
  };

  const handleConfirmTripRoute = () => {
    const startLocationFinal = startModalLocation || startLocation;
    const endLocationFinal = endModalLocation || endLocation;

    if (!startLocationFinal || !endLocationFinal) {
      Alert.alert("Error", "Please select both start and end locations.");
    } else if (
      startLocationFinal.latitude === endLocationFinal.latitude &&
      startLocationFinal.longitude === endLocationFinal.longitude
    ) {
      Alert.alert("Error", "Start and end locations cannot be the same.");
    } else if (startLocationFinal.address === endLocationFinal.address) {
      Alert.alert(
        "Error",
        "Start and end locations cannot be the same address."
      );
    } else {
      setIsMapWithRouteModalVisible(true);
    }
  };

  const handleContinue = () => {
    setIsMapWithRouteModalVisible(false);
    router.push("/(tabs)/(trips)/create_form");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plan Your Route</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Start Location</Text>
        <Switch
          value={isEnd}
          onValueChange={toggleSwitch}
          thumbColor="#FFFFFF"
          trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
          ios_backgroundColor="#D8B4FE"
        />
        <Text style={styles.switchLabel}>End Location</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {isEnd ? "End Location" : "Start Location"}
        </Text>
        <DropdownComponent
          data={dropdownData}
          placeholder={`Select a ${isEnd ? "end" : "start"} location`}
          onValueChange={setCurrentLocation}
          selectedValue={currentLocation}
        />
        <CustomButton
          title="Search"
          onPress={handleOpenModal}
          buttonStyle={styles.searchButton}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.multiLineInput}
          value={
            currentModalLocation?.address || currentLocation?.address || ""
          }
          editable={false}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <LocationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onLocationSelected={handleModalSelected}
      />

      {/* Button at the Bottom */}
      <View style={styles.bottomButtonContainer}>
        <CustomButton
          title="Confirm Trip Route"
          onPress={handleConfirmTripRoute}
        />
      </View>

      <MapWithRouteModal
        visible={isMapWithRouteModalVisible}
        onCancel={() => setIsMapWithRouteModalVisible(false)}
        onContinue={() => {
          setIsMapWithRouteModalVisible(false);
          router.push("/(tabs)/(trips)/create_form");
        }}
        startLocation={startLocation || startModalLocation}
        endLocation={endLocation || endModalLocation}
      />
    </SafeAreaView>
  );
};

export default CreateLocations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: defaultStyles.primaryColor,
    textAlign: "center",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  multiLineInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    textAlignVertical: "top",
    color: "#555",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginTop: 12,
  },
  searchButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: defaultStyles.primaryColor,
    borderRadius: 8,
  },
  sectionContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
