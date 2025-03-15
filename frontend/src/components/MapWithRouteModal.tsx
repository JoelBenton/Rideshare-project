import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  UrlTile,
} from "react-native-maps";

const MapWithRouteModal = ({
  visible,
  onCancel = () => {},
  onContinue = () => {},
  onClose = () => {},
  startLocation,
  endLocation,
  middleMarkers = [],
  mainMarker = null, // Optional main marker
  buttonType = "default", // "default" (Cancel/Continue) or "close" (single Close button)
}) => {
  if (!startLocation || !endLocation) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: mainMarker?.latitude || startLocation.latitude,
            longitude: mainMarker?.longitude || startLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
        >
          {/* Main Marker (if provided) */}
          {mainMarker && (
            <Marker
              coordinate={{
                latitude: mainMarker.latitude,
                longitude: mainMarker.longitude,
              }}
              // title="Requested Pickup Location"
              title={`Requested Pickup Location for: ${mainMarker.username}`}
              pinColor="purple"
            />
          )}

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
              title={marker.username}
              pinColor="blue"
            />
          ))}

          {/* Polyline */}
          <Polyline
            coordinates={[
              {
                latitude: startLocation.latitude,
                longitude: startLocation.longitude,
              },
              {
                latitude: endLocation.latitude,
                longitude: endLocation.longitude,
              },
            ]}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        </MapView>

        {/* Button Section */}
        <View style={styles.buttonContainer}>
          {buttonType === "default" ? (
            <>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onContinue}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          )}
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
  closeButton: {
    flex: 1,
    backgroundColor: "#555",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
