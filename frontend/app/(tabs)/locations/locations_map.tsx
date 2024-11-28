import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert, Text } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [startQuery, setStartQuery] = useState(""); // User's starting address or postcode
  const [endQuery, setEndQuery] = useState(""); // User's destination address or postcode
  const [startMarker, setStartMarker] = useState(null); // Start marker
  const [endMarker, setEndMarker] = useState(null); // End marker
  const [drivingTime, setDrivingTime] = useState(null); // Driving time between locations
  const mapRef = useRef(null); // Reference to the map

  const searchLocation = async (query, type) => {
    if (!query.trim()) {
      Alert.alert("Error", `Please enter a valid ${type} address or postcode.`);
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

        if (type === "start") {
          setStartMarker({
            coordinate: { latitude, longitude },
            title: display_name,
          });
        } else if (type === "end") {
          setEndMarker({
            coordinate: { latitude, longitude },
            title: display_name,
          });
        }

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

  const onMarkerDragEnd = async (e, type) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (type === "start") {
      setStartMarker((prevState) => ({
        ...prevState,
        coordinate: { latitude, longitude },
      }));
    } else if (type === "end") {
      setEndMarker((prevState) => ({
        ...prevState,
        coordinate: { latitude, longitude },
      }));
    }

    // Fetch driving time after marker drag
    if (startMarker && endMarker) {
      await getDrivingTime(startMarker.coordinate, endMarker.coordinate);
    }
  };

  const getDrivingTime = async (startCoord, endCoord) => {
    const { latitude: startLat, longitude: startLng } = startCoord;
    const { latitude: endLat, longitude: endLng } = endCoord;

    const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const drivingTimeInSeconds = data.routes[0].duration; // Duration in seconds
        const drivingTimeInMinutes = Math.round(drivingTimeInSeconds / 60); // Convert to minutes
        setDrivingTime(drivingTimeInMinutes);
      } else {
        Alert.alert("Error", "No route found for driving time.");
      }
    } catch (error) {
      console.error("Error fetching driving time:", error);
      Alert.alert("Error", "Unable to fetch driving time. Please try again later.");
    }
  };

  const confirmLocations = async () => {
    try {
      const fetchAddress = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          },
        });
        const data = await response.json();
        return data.display_name || "Unknown location";
      };

      const startAddress = startMarker
        ? await fetchAddress(
            startMarker.coordinate.latitude,
            startMarker.coordinate.longitude
          )
        : "No start location set";

      const endAddress = endMarker
        ? await fetchAddress(
            endMarker.coordinate.latitude,
            endMarker.coordinate.longitude
          )
        : "No end location set";

      Alert.alert(
        "Location Details",
        `Start Address: ${startAddress}\n\nEnd Address: ${endAddress}`
      );
    } catch (error) {
      console.error("Error fetching address:", error);
      Alert.alert(
        "Error",
        "Unable to fetch address details. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter start address or postcode"
          value={startQuery}
          onChangeText={setStartQuery}
        />
        <Button title="Search Start" onPress={() => searchLocation(startQuery, "start")} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter end address or postcode"
          value={endQuery}
          onChangeText={setEndQuery}
        />
        <Button title="Search End" onPress={() => searchLocation(endQuery, "end")} />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 51.08, // Centered around Ashford, Hythe, Folkestone, Canterbury
          longitude: 0.85,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {startMarker && (
          <Marker
            coordinate={startMarker.coordinate}
            title={startMarker.title}
            draggable
            onDragEnd={(e) => onMarkerDragEnd(e, "start")}
            description="Start location"
          />
        )}
        {endMarker && (
          <Marker
            coordinate={endMarker.coordinate}
            title={endMarker.title}
            draggable
            onDragEnd={(e) => onMarkerDragEnd(e, "end")}
            description="End location"
          />
        )}
      </MapView>

      {drivingTime !== null && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Estimated Driving Time: {drivingTime} minutes</Text>
        </View>
      )}

      <View style={styles.confirmButton}>
        <Button title="Confirm" onPress={confirmLocations} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  map: {
    flex: 1,
  },
  timeContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
  },
});