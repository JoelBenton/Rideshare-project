import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { defaultStyles } from '@/src/constants/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropdownComponent from '@/src/components/DropdownComponent';
import { useLocations } from '@/src/hooks/useLocations';
import type { Location } from '@/src/utils/types';
import LocationSearchModal from '@/src/components/LocationSearchModal';
import CustomButton from '@/src/components/CustomButton';

const CreateLocations = () => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [startModalLocation, setStartModalLocation] = useState<{ lat: string, lng: string, address: string } | null>(null);
  const [endModalLocation, setEndModalLocation] = useState<{ lat: string, lng: string, address: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEnd, setIsEnd] = useState(false); // Switch to toggle between Start and End locations

  const { data: locations = [] } = useLocations();

  const locationsData = (locations.data || []) as Location[];

  const dropdownData = locationsData.map(location => ({
    label: location.name,
    value: location,
  }));

  // Determine which location to show/edit based on the toggle
  const currentLocation = isEnd ? endLocation : startLocation;
  const currentModalLocation = isEnd ? endModalLocation : startModalLocation;

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const setCurrentLocation = (selectedLocation: Location) => {
    if (isEnd) {
      setEndLocation(selectedLocation);
      setEndModalLocation(null);
    } else {
      setStartLocation(selectedLocation);
      setStartModalLocation(null);
    }
  };

  const handleModalSelected = (selectedLocation: { lat: string, lng: string, address: string }) => {
    if (isEnd) {
      setEndModalLocation(selectedLocation);
      setEndLocation(null);
    } else {
      setStartModalLocation(selectedLocation);
      setStartLocation(null);
    }
  };

  const toggleSwitch = () => {
    setIsEnd(!isEnd);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plan Your Route</Text>
      {/* Switch to toggle between Start and End locations */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Start Location</Text>
        <Switch
          value={isEnd}
          onValueChange={toggleSwitch}
          thumbColor="#FFFFFF"
          trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
          ios_backgroundColor="#D8B4FE"
        />
        <Text style={styles.switchLabel}>End Location</Text>
      </View>

      {/* Section for Start/End Location Dropdown */}
      <Text style={styles.sectionTitle}>
        {isEnd ? "End Location" : "Start Location"}
      </Text>
      <DropdownComponent
        data={dropdownData}
        placeholder={`Select a ${isEnd ? "end" : "start"} location`}
        onValueChange={setCurrentLocation}
        selectedValue={currentLocation}
      />
      <CustomButton
        title="Search"
        onPress={handleOpenModal}
        buttonStyle={styles.searchButton}
      />

      {/* Address Field */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.multiLineInput}
        value={currentModalLocation?.address || currentLocation?.address || ''}
        editable={false}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Modal for Location Search */}
      <LocationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onLocationSelected={handleModalSelected}
      />
    </SafeAreaView>
  );
};

export default CreateLocations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: defaultStyles.primaryColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  multiLineInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    textAlignVertical: 'top',
    color: '#555',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 12,
  },
  searchButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: defaultStyles.primaryColor,
    borderRadius: 8,
  },
});