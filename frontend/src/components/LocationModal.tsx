import React from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

const LocationModal = ({ visible, location, onClose, draggable = false }) => {
  if (!location) return null; // Early return if no location is provided

  const { latitude, longitude, name } = location;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005, // Smaller delta for zoomed-in view
            longitudeDelta: 0.005, // Smaller delta for zoomed-in view
          }}
          // Set to 'true' to ensure updates to the region reflect on the map
          showsUserLocation={true}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          <Marker
            coordinate={{ latitude, longitude }}
            title={name}
            description={`Lat: ${latitude}, Lon: ${longitude}`}
            draggable={draggable}
          />
        </MapView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#ff5c5c",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LocationModal;