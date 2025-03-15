import React, { useState, useRef, useEffect } from "react";
import { Modal, View, TextInput, Alert, StyleSheet } from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  UrlTile,
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./CustomButton";

const MapWithSearchAndRoute = ({
  visible,
  onCancel,
  onRequest,
  startLocation,
  endLocation,
}) => {
  const [query, setQuery] = useState(""); // User's search query
  const [marker, setMarker] = useState(null); // User-placed marker
  const mapRef = useRef(null); // Reference to the map

  useEffect(() => {
    if (startLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        },
        1000
      );
    }
  }, [startLocation]);

  const searchLocation = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a valid address or postcode.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&countrycodes=gb&limit=1`,
        {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        setMarker({
          coordinate: { latitude, longitude },
          title: display_name,
        });

        mapRef.current?.animateToRegion(
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

  const handleOnConfirm = () => {
    if (!marker) {
      Alert.alert("Error", "Please select a location.");
      return;
    } else if (
      marker.coordinate.latitude === startLocation.lat &&
      marker.coordinate.longitude === startLocation.lng
    ) {
      Alert.alert("Error", "Please select a different location.");
      return;
    } else if (
      marker.coordinate.latitude === endLocation.lat &&
      marker.coordinate.longitude === endLocation.lng
    ) {
      Alert.alert("Error", "Please select a different location.");
      return;
    }
    // Handle confirm logic here
    onRequest({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      address: marker.title,
    });
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
              latitude: startLocation.lat,
              longitude: startLocation.lng,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {startLocation && (
              <Marker
                coordinate={{
                  latitude: startLocation.lat,
                  longitude: startLocation.lng,
                }}
                title="Start Location"
                pinColor="green"
              />
            )}
            {endLocation && (
              <Marker
                coordinate={{
                  latitude: endLocation.lat,
                  longitude: endLocation.lng,
                }}
                title="End Location"
                pinColor="red"
              />
            )}
            {startLocation && endLocation && (
              <Polyline
                coordinates={[
                  { latitude: startLocation.lat, longitude: startLocation.lng },
                  { latitude: endLocation.lat, longitude: endLocation.lng },
                ]}
                strokeColor="#0000FF"
                strokeWidth={3}
              />
            )}
            {marker && (
              <Marker
                coordinate={marker.coordinate}
                title={marker.title}
                draggable
                onDragEnd={onMarkerDragEnd}
                pinColor="blue"
              />
            )}
          </MapView>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancel"
              onPress={onCancel}
              buttonStyle={styles.button}
            />
            <CustomButton
              title="Confirm"
              onPress={handleOnConfirm}
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

export default MapWithSearchAndRoute;
