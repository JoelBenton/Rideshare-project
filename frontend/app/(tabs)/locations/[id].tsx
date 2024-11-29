import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { defaultStyles } from '@/src/constants/themes';
import CustomButton from '@/src/components/CustomButton';
import type { Location } from '@/src/utils/types';
import { getLocation } from '@/src/hooks/useLocations';
import { useGlobalSearchParams } from 'expo-router';
import LocationModal from '@/src/components/LocationModal';
import { ActivityIndicator } from 'react-native-paper';

const CreateLocationPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [location, setLocation] = useState<Location>();
  const [loading, setLoading] = useState(true);

  const { id } = useGlobalSearchParams<{ id: string }>();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const { success, data } = await getLocation(id);
    if (success) {
      setLocation(data);
    } else {
      setLocation(undefined);
    }
    setLoading(false);
  };

  const handleViewLocation = () => {
    setIsModalVisible(true);
  };

  if (loading) {
    return (
        <ActivityIndicator size='large' style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}/>
    )
  }

  if (!loading && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Location not found</Text>
        <CustomButton title="refresh" onPress={fetchLocations} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{location.name}</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Public - {location.public ? 'Yes' : 'No'}</Text>
      </View>

      {/* Location Section */}
      <Text style={styles.label}>Location</Text>
      <CustomButton
        title="View"
        onPress={handleViewLocation}
        buttonStyle={styles.searchButton}
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.multiLineInput}
        value={location.address}
        editable={false}
        multiline={true}
        numberOfLines={8}
        textAlignVertical='top'
      />

      {/* Coordinates */}
      <Text style={styles.label}>Coordinates</Text>
      <TextInput
        style={styles.input}
        value={`Lat: ${location.latitude}, Lon: ${location.longitude}`}
        editable={false}
      />

      {/* Create Button */}
      {/* <CustomButton
        title="Create"
        onPress={handleCreateLocation}
        buttonStyle={styles.createButton}
      /> */}

      {/* Modal for Location Search */}
      <LocationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        location={location}
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
});

export default CreateLocationPage;