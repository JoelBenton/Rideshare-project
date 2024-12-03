import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultStyles } from '@/src/constants/themes';
import CustomButton from '@/src/components/CustomButton';
import LocationSearchModal from '@/src/components/LocationSearchModal';
import type { createLocation } from '@/src/utils/types';
import { useCreateLocation } from '@/src/hooks/useLocations';
import { router, useRouter } from 'expo-router';

const CreateLocationPage = () => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [location, setLocation] = useState<createLocation>(null);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    async function createLocation() {
      if (create) {
        // Call the mutation
        const success = await createLocationMutation();
  
        if (!success) {
          Alert.alert('Error', 'Failed to create location. Please try again.');
          return;
        }
  
        // Show success alert
        Alert.alert('Success', 'Location created successfully.');
        router.back();
      }
    }
  
    createLocation();
  }, [create, location]);

  // Access the mutation hook for location creation
  const { mutateAsync: createLocationMutation } = useCreateLocation(location);

  const router = useRouter();

  const handleSearchLocation = () => {
    setIsModalVisible(true);
  };

  const handleLocationSelected = (selectedLocation) => {
    setAddress(selectedLocation.address);
    setCoordinates({ lat: selectedLocation.lat, lon: selectedLocation.lng });
    setIsModalVisible(false);
  };

  const handleCreateLocation = async () => {
    // Check for required fields before proceeding
    if (!name.trim() || !address.trim() || !coordinates.lat || !coordinates.lon) {
      Alert.alert('Error', 'All fields are required. Please fill in the name, address, and location.');
      return;
    }

    // If Public, show confirmation popup
    if (isPublic) {
      Alert.alert(
        "Confirm your choice",
        "Are you sure you want to create a public location? This location will be visible to all users.",
        [
          {
            text: "Cancel",
            onPress: () => { return },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              setLocation({
                name: name,
                public: isPublic,
                address: address,
                latitude: Number(coordinates.lat),
                longitude: Number(coordinates.lon),
              });

              setCreate(true);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      setLocation({
        name,
        public: isPublic,
        address,
        latitude: Number(coordinates.lat),
        longitude: Number(coordinates.lon),
      });

      setCreate(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create Location</Text>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Location Name"
        value={name}
        onChangeText={setName}
      />

      {/* Public Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Public</Text>
        <Text style={styles.switchOption}>No</Text>
        <Switch
          value={isPublic}
          onValueChange={(value) => setIsPublic(value)}
          thumbColor="#FFFFFF"
          trackColor={{ false: "#D8B4FE", true: "#A78BFA" }}
          ios_backgroundColor="#D8B4FE"
        />
        <Text style={styles.switchOption}>Yes</Text>
      </View>

      {/* Location Section */}
      <Text style={styles.label}>Location</Text>
      <CustomButton
        title="Search"
        onPress={handleSearchLocation}
        buttonStyle={styles.searchButton}
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <Text style={styles.addressHint}>* Selected Address may not be 100% accurate. However, it is only used for display purposes.</Text>
      <TextInput
        style={styles.multiLineInput}
        value={address}
        editable={false}
        multiline={true}
        numberOfLines={8}
        textAlignVertical='top'
      />

      {/* Coordinates */}
      <Text style={styles.label}>Coordinates</Text>
      <TextInput
        style={styles.input}
        value={`Lat: ${coordinates.lat}, Lon: ${coordinates.lon}`}
        editable={false}
      />

      {/* Create Button */}
      <CustomButton
        title="Create"
        onPress={handleCreateLocation}
        buttonStyle={styles.createButton}
      />

      {/* Modal for Location Search */}
      <LocationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onLocationSelected={handleLocationSelected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: defaultStyles.primaryColor,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  multiLineInput: {
    height: 80, // Initial height
    borderWidth: 1,
    paddingLeft: 8,
    borderColor: 'gray',
    paddingTop: 8,  // Padding to give some space above the text
    marginBottom: 12,
    borderRadius: 8,
    textAlignVertical: 'top',  // Ensures text starts from the top
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  switchOption: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  searchButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  createButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    fontSize: 16,
    color: defaultStyles.primaryColor,
    marginVertical: 10,
  },
  addressHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
});

export default CreateLocationPage;