import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./CustomButton";

const LocationSearchModal = ({ visible, onClose, onLocationSelected }) => {
  const [query, setQuery] = useState(""); // User's search query
  const [marker, setMarker] = useState(null); // Selected marker
  const mapRef = useRef(null); // Reference to the map

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
      console.log("Confirming location:", latitude, longitude);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        },
      });
      const data = await response.json();
      console.log(data);
      const fullAddress = data.display_name || "Unknown location";

      onLocationSelected({ lat: latitude, lng: longitude, address: fullAddress });
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
          <CustomButton title="Search" onPress={searchLocation} buttonStyle={styles.button}/>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 51.08, // Default to a location centered around Ashford, UK
              longitude: 0.85,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
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
            <CustomButton title="Confirm Location" onPress={confirmLocation} buttonStyle={styles.button}/>
            <CustomButton title="Cancel" onPress={onClose} buttonStyle={styles.button}/>
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
    marginVertical: 5
  },
});

export default LocationSearchModal;