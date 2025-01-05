import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const options = [
    { title: 'Edit Profile', action: () => {} },
    { title: 'Change Password', action: () => router.push('/profile/changePassword') },
    { title: 'Ride History', action: () => router.push('/(tabs)/(trips)/history') },
    { title: 'Log Out', action: () => signOut(FIREBASE_AUTH) },
  ];

  const renderOption = ({ item }) => (
    <TouchableOpacity style={styles.optionButton} onPress={item.action}>
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome,</Text>
        <Text style={styles.username}>{user.displayName || 'User'}</Text>
      </View>

      {/* Options List */}
      <FlatList
        data={options}
        keyExtractor={(item) => item.title}
        renderItem={renderOption}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6a0dad',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: '400',
  },
  username: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileScreen;