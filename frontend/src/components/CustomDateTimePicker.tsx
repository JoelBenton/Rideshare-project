import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { init } from "@rematch/core";

type CustomDateTimePickerProps = {
  visible: boolean; // Control modal visibility
  mode: "time" | "date"; // Picker mode: "time" or "date"
  initialValue?: Date; // Initial date/time value
  onClose: () => void; // Callback to close the modal
  onConfirm: (selectedDate: Date) => void; // Callback for confirming selection
};

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  visible,
  mode,
  initialValue = new Date(),
  onClose,
  onConfirm,
}) => {
  const minimumDate = mode === "date" ? initialValue : undefined;
  const [date, setDate] = useState(initialValue);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      // Directly confirm and close for Android
      onClose(); 
      if (selectedDate) {
        setDate(selectedDate);
        onConfirm(selectedDate);
      }
    } else if (selectedDate) {
      setDate(selectedDate); // Update temp value for iOS
    }
  };

  const handleConfirm = () => {
    onConfirm(date); // Pass final value to parent
    onClose(); // Close modal
  };

  return (
    <>
      {Platform.OS === "ios" && (
        <Modal
          visible={visible}
          transparent={true}
          animationType="slide"
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.modalTitle}>
                Select a {mode === "time" ? "Time" : "Date"}
              </Text>
              <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={true}
                display="spinner" // Display spinner on iOS
                onChange={handleChange}
                minimumDate={minimumDate} // Add one day to minimum date for date picker
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android DateTimePicker */}
      {Platform.OS === "android" && visible && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default" // Default picker for Android
          onChange={handleChange}
          minimumDate={mode === "date" ? new Date() : undefined}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomDateTimePicker;