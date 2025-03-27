import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

const EditTripModal = ({ trip, visible, onClose, onSave }) => {
  const [tripName, setTripName] = useState(trip.trip_name);
  const [totalSeats, setTotalSeats] = useState(
    trip.vehicle.seats_available + trip.vehicle.seats_occupied
  );
  const [carMake, setCarMake] = useState(trip.vehicle.make);
  const [carColor, setCarColor] = useState(trip.vehicle.color);
  const [registration, setRegistration] = useState(trip.vehicle.registration);

  const handleSave = () => {
    if (totalSeats < trip.vehicle.seats_occupied || totalSeats < 1) {
      alert(
        "Total seats cannot be less than occupied seats and must be at least 1!"
      );
      return;
    }

    onSave({
      trip_name: tripName,
      seats_available: totalSeats - trip.vehicle.seats_occupied,
      Make: carMake,
      Registration: registration,
      Color: carColor,
    });

    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit Trip</Text>

          <Text style={styles.label}>Trip Name</Text>
          <TextInput
            style={styles.input}
            value={tripName}
            onChangeText={setTripName}
            placeholder="Enter trip name"
          />

          <Text style={styles.label}>Total Seats</Text>
          <TextInput
            style={styles.input}
            value={totalSeats.toString()}
            onChangeText={(text) => setTotalSeats(Number(text))}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Car Make</Text>
          <TextInput
            style={styles.input}
            value={carMake}
            onChangeText={setCarMake}
            placeholder="Enter car make"
          />

          <Text style={styles.label}>Car Color</Text>
          <TextInput
            style={styles.input}
            value={carColor}
            onChangeText={setCarColor}
            placeholder="Enter car color"
          />

          <Text style={styles.label}>Registration</Text>
          <TextInput
            style={styles.input}
            value={registration}
            onChangeText={setRegistration}
            placeholder="Enter registration"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4B0082",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#4caf50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditTripModal;
