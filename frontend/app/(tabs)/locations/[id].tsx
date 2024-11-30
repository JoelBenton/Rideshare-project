import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultStyles } from '@/src/constants/themes';
import CustomButton from '@/src/components/CustomButton';
import type { Location } from '@/src/utils/types';
import { getLocation, updateLocation } from '@/src/hooks/useLocations'; // Ensure `updateLocation` exists in your hook
import { useGlobalSearchParams } from 'expo-router';
import LocationModal from '@/src/components/LocationModal';
import { ActivityIndicator } from 'react-native-paper';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import LocationSearchModal from '@/src/components/LocationSearchModal';

const CreateLocationPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [location, setLocation] = useState<Location>();
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [updatedLocation, setUpdatedLocation] = useState<Location | null>(null);

  const { id } = useGlobalSearchParams<{ id: string }>();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const { success, data } = await getLocation(id);
    if (success) {
      setLocation(data);
      setUpdatedLocation(data);
      if (data.creatorUid === FIREBASE_AUTH.currentUser?.uid) {
        setCanEdit(true);
      }
    } else {
      setLocation(undefined);
    }
    setLoading(false);
  };

  const handleViewLocation = () => {
    setIsModalVisible(true);
  };

  const handleToggleEdit = () => {
    setEditing(!isEditing);
    if (!isEditing) {
      // Reset changes when exiting edit mode
      setUpdatedLocation(location);
    }
  };

  const saveChanges = async () => {
        setLoading(true);
        const { success } = await updateLocation(id, updatedLocation); // Update API call
        if (success) {
            //   setLocation(updatedLocation);
            Alert.alert('Success', 'Location updated successfully.');
            setEditing(false);
        } else {
            Alert.alert('Error', 'Failed to update location.');
        }
        setLoading(false);
  }

  const handleSaveChanges = async () => {
    if (updatedLocation?.public) {
        Alert.alert(
          "Confirm your choice",
          "Are you sure you want to create a public location? This location will be visible to all users.",
          [
            {
              text: "Cancel",
              onPress: () => {return},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {saveChanges()},
            },
          ],
          { cancelable: false }
        );
      }
    if (!updatedLocation) return;
    saveChanges();
  };

  const handleLocationSelected = (selectedAddress) => {
    console.log('Selected Address:', selectedAddress);
    setUpdatedLocation({
      ...updatedLocation,
      address: selectedAddress.address,
      latitude: selectedAddress.lat,
      longitude: selectedAddress.lng
    });
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  if (!loading && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Location not found</Text>
        <CustomButton title="Refresh" onPress={fetchLocations} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Edit Location' : location?.name}
      </Text>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Location Name"
        value={updatedLocation?.name}
        editable={isEditing}
        onChangeText={(text) =>
          setUpdatedLocation({ ...updatedLocation, name: text })
        }
      />

      {/* Public Toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          Public - {updatedLocation?.public ? 'Yes' : 'No'}
        </Text>
        {isEditing && (
          <Switch
            value={updatedLocation?.public}
            onValueChange={(value) =>
              setUpdatedLocation({ ...updatedLocation, public: value })
            }
          />
        )}
      </View>

      {/* Location Section */}
      <Text style={styles.label}>Location</Text>
      <CustomButton
        title={ isEditing ? 'Change Location' : 'View Location'}
        onPress={handleViewLocation}
        buttonStyle={styles.searchButton}
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.multiLineInput}
        value={updatedLocation?.address}
        editable={false}
        multiline={true}
        numberOfLines={8}
        textAlignVertical="top"
      />

      {/* Coordinates */}
      <Text style={styles.label}>Coordinates</Text>
      <TextInput
        style={styles.input}
        value={`Lat: ${updatedLocation?.latitude}, Lon: ${updatedLocation?.longitude}`}
        editable={false}
      />

      {/* Action Buttons */}
      {canEdit && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {isEditing ? (
            <>
              <CustomButton
                title="Save"
                onPress={handleSaveChanges}
                buttonStyle={styles.saveButton}
              />
              <CustomButton
                title="Cancel"
                onPress={handleToggleEdit}
                buttonStyle={styles.cancelButton}
              />
            </>
          ) : (
            <CustomButton
              title="Edit"
              onPress={handleToggleEdit}
              buttonStyle={styles.createButton}
            />
          )}
        </View>
      )}

      { (canEdit && isEditing) ? (
        <LocationSearchModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onLocationSelected={handleLocationSelected}
            location={{ latitude: updatedLocation?.latitude, longitude: updatedLocation?.longitude }}
        />
      ) : (
        <LocationModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            location={updatedLocation}
        />
      )}

      
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
    height: 80,
    borderWidth: 1,
    paddingLeft: 8,
    borderColor: 'gray',
    paddingTop: 8, 
    marginBottom: 12,
    borderRadius: 8,
    textAlignVertical: 'top',
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
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '48%',
  },
});

export default CreateLocationPage;