import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FIRESTORE_DB } from '@/src/config/FirebaseConfig';
import { addDoc, collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/src/context/AuthContext';
import { Link } from 'expo-router';

const ChatGroups = () => {
  const [groups, setGroups] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const ref = collection(FIRESTORE_DB, 'groups');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const groupsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupsData);
    });

    return unsubscribe;
  }, []);

  // const startGroup = async () => {
  //   try {
  //     await addDoc(collection(FIRESTORE_DB, 'groups'), {
  //       name: `Group ${Math.floor(Math.random() * 1000)}`,
  //       description: 'This is a chat group',
  //       creator: user.uid,
  //     });
  //   } catch (error) {
  //     console.log('Error Creating Group', error);
  //   }
  // };

  if (groups.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.groupsList}>
          <Text style={styles.groupName}>No Chat Groups Found</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.groupsList}>
        {groups.map((group) => (
          <Link key={group.id} href={`/chat/${group.id}`} asChild>
            <TouchableOpacity style={styles.groupCard}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4B0082" style={styles.groupIcon} />
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B0082" />
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  groupsList: {
    padding: 20,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  groupIcon: {
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  groupDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#4B0082',
    borderRadius: 28,
    elevation: 5,
  },
});

export default ChatGroups;