import React, { useState, useRef, useEffect } from "react";
import { Modal, View, TextInput, Alert, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./CustomButton";

const LocationSearchModal = ({
  visible,
  onClose,
  onLocationSelected,
  location = null,
}) => {
  const [query, setQuery] = useState(""); // User's search query
  const [marker, setMarker] = useState(
    location
      ? {
          coordinate: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          title: location.name || "Selected Location",
        }
      : null
  ); // Initial marker if location is provided
  const mapRef = useRef(null); // Reference to the map

  useEffect(() => {
    // If a location is passed, set the map to focus on it
    if (location) {
      setMarker({
        coordinate: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        title: location.name || "Selected Location",
      });

      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  }, [location]);

  const searchLocation = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a valid address or postcode.");
      return;
    }

    try {
      // Query Nominatim's geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&countrycodes=gb&limit=1`,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];

        // Update marker and map region
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        setMarker({
          coordinate: { latitude, longitude },
          title: display_name,
        });

        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      } else {
        Alert.alert("Error", "Location not found. Try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to fetch location. Please try again later.");
    }
  };

  const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker((prevState) => ({
      ...prevState,
      coordinate: { latitude, longitude },
    }));
  };

  const confirmLocation = async () => {
    if (marker) {
      const { latitude, longitude } = marker.coordinate;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        },
      });
      const data = await response.json();
      const fullAddress = data.display_name || "Unknown location";

      onLocationSelected({
        lat: latitude as string,
        lng: longitude as string,
        address: fullAddress as string,
      });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Search for a location"
            value={query}
            onChangeText={setQuery}
          />
          <CustomButton
            title="Search"
            onPress={searchLocation}
            buttonStyle={styles.button}
          />

          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 51.08, // Default to Ashford, UK
              longitude: 0.85,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {marker && (
              <Marker
                coordinate={marker.coordinate}
                title={marker.title}
                draggable
                onDragEnd={onMarkerDragEnd}
              />
            )}
          </MapView>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Confirm Location"
              onPress={confirmLocation}
              buttonStyle={styles.button}
            />
            <CustomButton
              title="Cancel"
              onPress={onClose}
              buttonStyle={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    width: "48%",
    height: 40,
    marginHorizontal: 2,
    marginVertical: 5,
  },
});

export default LocationSearchModal;
