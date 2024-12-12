import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";

const MapWithRouteModal = ({
  visible,
  onCancel,
  onContinue,
  startLocation,
  endLocation,
  middleMarkers = [],
}) => {
  if (!startLocation || !endLocation) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          showsUserLocation={true}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />

          {/* Start Location Marker */}
          <Marker
            coordinate={{
              latitude: startLocation.latitude,
              longitude: startLocation.longitude,
            }}
            title="Start Location"
            pinColor="green"
          />

          {/* End Location Marker */}
          <Marker
            coordinate={{
              latitude: endLocation.latitude,
              longitude: endLocation.longitude,
            }}
            title="End Location"
            pinColor="red"
          />

          {/* Middle Markers */}
          {middleMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.address}
              pinColor="blue"
            />
          ))}

          {/* Polyline */}
          <Polyline
            coordinates={[
              { latitude: startLocation.latitude, longitude: startLocation.longitude },
              { latitude: endLocation.latitude, longitude: endLocation.longitude },
            ]}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MapWithRouteModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#ff5c5c",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});