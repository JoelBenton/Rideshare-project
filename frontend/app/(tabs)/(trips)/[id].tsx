import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useTrip } from "@/src/hooks/useTrips";
import { convertDate, convertToDate } from "@/src/utils/date";
import { useAuth } from "@/src/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import MapWithSearchAndRoute from "@/src/components/MapWitSearchAndRoute";
import { useCreatePassenger, useOwnerUpdatePassenger } from "@/src/hooks/usePassengers";
import { CreatePassenger, Passenger, TripPassengerFormat } from "@/src/utils/types";
import MapWithRouteModal from "@/src/components/MapWithRouteModal";

const TripDetailsPage = () => {
    const [active, setActive] = useState(false);
    const [full, setFull] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisiblePassenger, setIsModalVisiblePassenger] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [isRequestAccepted, setIsRequestAccepted] = useState(false);
    const [passenger, setPassenger] = useState<CreatePassenger | null>(null);
    const [create, setCreate] = useState(false);
    const [updatePassengerRequest, setUpdatePassengerRequest] = useState(false);
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [updatePassenger, setUpdatePassenger] = useState(null);
    const [status, setStatus] = useState(null);
    const [pending, setPending] = useState(null);

    const { user } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: trip, isLoading: isLoadingTrip, isFetching } = useTrip(id);

    const {mutateAsync: requestToJoinTrip} = useCreatePassenger(passenger);
    const {mutateAsync: ownerUpdatePassenger} = useOwnerUpdatePassenger(updatePassenger, trip?.id, status, pending);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (trip?.data?.date_of_trip) {
            if (convertToDate(trip.data.date_of_trip) > new Date()) {
                setActive(true);
            }
        }

        if (trip?.data?.seats_available && trip?.data?.seats_occupied) {
            if (trip.data.seats_available - trip.data.seats_occupied === 0) {
                setFull(true);
            }
        }

        if (user?.uid === trip?.data?.driver.id) {
            setIsOwner(true);
        }

        if (trip?.data?.passengers) {
            if (trip.data.passengers.some((passenger) => passenger.driver.id === user?.uid)) {
                setIsRequestSent(true);

                if (trip.data.passengers.some((passenger) => passenger.driver.id === user?.uid && passenger.status === 'confirmed')) {
                    setIsRequestAccepted(true);
                }
            }
        }
    }, [trip?.data]);

    useEffect(() => {
        if (create && passenger) {
            setIsRequestLoading(true);
            requestToJoinTrip()
                .then(() => {
                    Alert.alert('Success', 'Request to join trip sent successfully.');
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to send request to join trip.');
                    setIsModalVisible(true);
                })
                .finally(() => {
                    setCreate(false);
                    setIsRequestLoading(false);
                });
        }
    }, [create, passenger]);

    useEffect(() => {
        if (updatePassengerRequest == true && updatePassenger != null) {
            ownerUpdatePassenger()
                .then(() => {
                    Alert.alert('Success', 'Passenger status updated successfully.');
                    queryClient.invalidateQueries({ queryKey:['trip', id]});
                })
                .catch((error) => {
                    Alert.alert('Error', `Failed to update passenger status. ${error}`);
                })
                .finally(() => {
                    setUpdatePassengerRequest(false);
                });
        }
    }, [updatePassengerRequest, updatePassenger])

    if (isLoadingTrip) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" style={styles.loader} />
            </SafeAreaView>
        );
    }

    if (!trip && !isLoadingTrip) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Trip not found.</Text>
            </SafeAreaView>
        );
    }

    const handleRequestToJoin = () => {
        setIsModalVisible(true);
    };

    const handleEditTrip = () => {
        if (trip.data.seats_occupied === 0) {
            return;
        }
        else {
            Alert.alert(
                "Failed",
                "Trip already has passengers, cannot edit.",
                [
                    {
                        text: "OK",
                    },
                ]
            )
        }
    };

    const handleCancelTrip = () => {

        if (trip.data.seats_occupied === 0) {
            Alert.alert(
                "Cancel Trip",
                "Are you sure you want to cancel this trip?",
                [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {},
                    },
                ],
                { cancelable: true }
            );
        }
        else {
            Alert.alert(
                "Failed",
                "Trip already has passengers, cannot cancel. Please contact the passengers using the chat feature to cancel verbally.",
                [
                    {
                        text: "OK",
                        onPress: () => {},
                    },
                ]
            )
        }
    };


    const handleAcceptPassenger = (passenger: TripPassengerFormat) => {        
        Alert.alert(
            "Accept Passenger",
            `Are you sure you want to accept ${passenger.driver.username} as a passenger?`,
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Continue",
                    onPress: () => {
                        setStatus('confirmed');
                        setPending(false);

                        setUpdatePassengerRequest(true);
                        setUpdatePassenger(passenger);
                    },
                },
            ],
            { cancelable: true }
        )
    };

    const handleRejectPassenger = (passenger: TripPassengerFormat) => {
        Alert.alert(
            "Reject Passenger",
            `Are you sure you want to reject ${passenger.driver.username} as a passenger?`,
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Continue",
                    onPress: () => {
                        setStatus('declined');
                        setPending(false);

                        setUpdatePassengerRequest(true);
                        setUpdatePassenger(passenger);
                    },
                },
            ],
            { cancelable: true }
        )
    };

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey:['trip', id]});
    };

    const handleRequestToJoinModal = (coordinates: { latitude: string; longitude: string, address: string}) => {
        setIsModalVisible(false);
        setIsRequestLoading(true);

        setPassenger({
            trip_id: trip.data.id,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            address: coordinates.address,
            user_uid: user.uid,
        })

        setCreate(true);
    };

    const handleCloseViewPassengerModal = () => {
        setIsModalVisiblePassenger(false);
    }

    const handleViewPassenger = (passenger) => {
        setSelectedPassenger(passenger);
        setIsModalVisiblePassenger(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Trip Name Row */}
                <View style={styles.tripNameContainer}>
                    <TouchableOpacity style={styles.refreshIcon} onPress={handleRefresh} disabled={isFetching}>
                        <Ionicons name="refresh-outline" size={24} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.tripName}>{trip.data.trip_name}</Text>
                    {isOwner && (
                        <TouchableOpacity style={styles.editIcon} onPress={() => handleEditTrip()}>
                            <Ionicons name="create-outline" size={24} color="#555" />
                        </TouchableOpacity>
                    )}
                </View>
                {!active ? (
                    <Text style={styles.inactiveText}>Inactive</Text>
                ) : null}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Date and Time */}
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        Date: {convertDate(trip.data.date_of_trip)}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        Time: {trip.data.time_of_trip}
                    </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Origin and Destination */}
                <Text style={styles.sectionTitle}>Trip Locations</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#007BFF" />
                    <Text style={styles.infoTitle}>Origin:</Text>
                </View>
                <Text style={styles.addressText}>{trip.data.origin.address}</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="location-sharp" size={20} color="#FF4500" />
                    <Text style={styles.infoTitle}>Destination:</Text>
                </View>
                <Text style={styles.addressText}>{trip.data.destination.address}</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Vehicle Information */}
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="car-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        {trip.data.vehicle.make} ({trip.data.vehicle.color})
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="key-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        Registration: {trip.data.vehicle.registration}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        Seats Occupied: {trip.data.vehicle.seats_occupied}/
                        {trip.data.vehicle.seats_available}
                    </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Driver Information */}
                <Text style={styles.sectionTitle}>Driver Information</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#333" />
                    <Text style={styles.infoText}>
                        Driver: {trip.data.driver.username}{" "}
                        {isOwner ? "(You)" : ""}
                    </Text>
                </View>

                {/* Pending Passengers Section */}
                {isOwner && (
                <>
                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Pending Passengers Section */}
                    <Text style={styles.sectionTitle}>Pending Passenger Requests</Text>
                    {trip.data.passengers.filter((p) => p.pending).length > 0 ? (
                    trip.data.passengers
                        .filter((passenger) => passenger.pending == 1)
                        .map((passenger) => (
                        <View key={passenger.id} style={styles.passengerContainer}>
                            <Text style={styles.passengerText}>
                            {passenger.driver.username} - {passenger.address}
                            </Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.requestButton, { backgroundColor: "green", marginRight: 10 }]}
                                    onPress={() => handleAcceptPassenger(passenger)}
                                    disabled={updatePassengerRequest}
                                >
                                    <Text style={styles.requestButtonText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.requestButton, { backgroundColor: "red" }]}
                                    onPress={() => handleRejectPassenger(passenger)}
                                    disabled={updatePassengerRequest}
                                >
                                    <Text style={styles.requestButtonText}>Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.requestButton, { backgroundColor: "blue", marginLeft: 10 }]}
                                    onPress={() => handleViewPassenger(passenger)}
                                    disabled={updatePassengerRequest}
                                >
                                    <Text style={styles.requestButtonText}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ))
                    ) : (
                    <Text style={styles.noPassengersText}>No pending requests.</Text>
                    )}
                </>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Accepted Passengers Section */}
                <Text style={styles.sectionTitle}>{isOwner ? "Accepted Passengers" : "Passengers"}</Text>
                {trip.data.passengers.filter((p) => !p.pending).length > 0 ? (
                trip.data.passengers
                    .filter((passenger) => passenger.pending == 0)
                    .map((passenger) => (
                    <View key={passenger.id} style={styles.passengerContainer}>
                        <Text style={styles.passengerText}>
                        {passenger.driver.username} - {passenger.address}
                        </Text>
                    </View>
                    ))
                ) : (
                <Text style={styles.noPassengersText}>{isOwner ? "No accepted passengers yet." : "No passengers yet."}</Text>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Request to Join Button */}
                {!isOwner && active && !full && !isRequestSent && !isRequestAccepted && (
                    <TouchableOpacity
                        style={ isRequestLoading ? [styles.requestButton, { opacity: 0.5 }] : styles.requestButton}
                        onPress={() => handleRequestToJoin()}
                        disabled={isRequestLoading}
                    >
                        <Text style={styles.requestButtonText}>Request to Join</Text>
                    </TouchableOpacity>
                )}

                {!isOwner && active && !full && isRequestSent && !isRequestAccepted && (
                    <View style={styles.requestButton}>
                        <Text style={styles.requestButtonText}>Request sent</Text>
                    </View>
                )}

                {/* Cancel Trip Button */}
                {isOwner && active && !full && (
                    <TouchableOpacity
                        style={[styles.requestButton, { backgroundColor: "red" }]}
                        onPress={() => handleCancelTrip()}
                    >
                        <Text style={styles.requestButtonText}>Cancel Trip</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
            <MapWithSearchAndRoute
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onRequest={handleRequestToJoinModal}
                startLocation={trip.data.origin}
                endLocation={trip.data.destination}
            />
            <MapWithRouteModal
                visible={isModalVisiblePassenger}
                onClose={handleCloseViewPassengerModal}
                startLocation={{
                    latitude: Number(trip.data.origin.lat),
                    longitude: Number(trip.data.origin.lng),
                    address: Number(trip.data.origin.address),
                }}
                endLocation={{
                    latitude: Number(trip.data.destination.lat),
                    longitude: Number(trip.data.destination.lng),
                    address: trip.data.destination.address,
                }}
                middleMarkers={trip.data.passengers
                    .filter((p) => p.pending === 0 && (!selectedPassenger || p.id !== selectedPassenger.id)) // Exclude selected passenger
                    .map((p) => ({
                        latitude: Number(p.lat),
                        longitude: Number(p.lng),
                        address: p.address,
                        username: p.driver.username,
                    }))
                }
                mainMarker={selectedPassenger ? {
                    latitude: Number(selectedPassenger.lat),
                    longitude: Number(selectedPassenger.lng),
                    address: selectedPassenger.address,
                    username: selectedPassenger.driver.username,
                } : null}
                buttonType="close"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 20,
  },
  tripNameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  tripName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082",
    textAlign: "center",
  },
  editIcon: {
    position: "absolute",
    right: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    marginLeft: 28, // Add padding for alignment with icons
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4B0082",
    marginBottom: 10,
  },
  passengerContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  passengerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  passengerMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noPassengersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  activeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  inactiveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
  requestButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  requestButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  acceptedPassengerContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F0F8FF",
  },
  acceptedPassengerText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  refreshIcon: {
    position: "absolute",
    left: 0,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default TripDetailsPage;