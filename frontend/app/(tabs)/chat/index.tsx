import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FIRESTORE_DB } from '@/src/config/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/src/context/AuthContext';
import { Link } from 'expo-router';

const ChatGroups = () => {
  const [groups, setGroups] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const ref = collection(FIRESTORE_DB, 'groups');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const groupsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name as string, 
          creator: doc.data().creator as string,
          users: doc.data().users as string[],
          trip_id: doc.data().trip_id as string,
          date_of_trip: doc.data().date_of_trip as string,
        }))
        .filter((group) => group.creator === user?.uid || group.users?.includes(user?.uid)); // Filter by creator or users array

      groupsData.sort((a, b) => {
        const parseDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split('-');
          return new Date(`20${year}-${month}-${day}`);
        };
        
        const dateA = parseDate(a.date_of_trip);
        const dateB = parseDate(b.date_of_trip);
        return dateB.getTime() - dateA.getTime(); // Sort by most recent first
      });
    
      setGroups(groupsData);
    });

    return unsubscribe;
  }, [user]);

  if (groups.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.groupsList}>
          <Text style={styles.groupName}>No Chat Groups Found</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }


const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(`20${year}-${month}-${day}`); // Adjust year to full format (e.g., "24" -> "2024")
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.groupsList}>
        {groups.map((group) => (
          <Link key={group.id} href={`/chat/${group.id}`} asChild>
            <TouchableOpacity style={styles.groupCard}>
              {/* Group Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="people-circle-outline" size={40} color="#6A5ACD" />
              </View>

              {/* Group Information */}
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDate}>
                  Trip Date: {parseDate(group.date_of_trip).toLocaleDateString()}
                </Text>
                {group.creator === user?.uid && (
                  <Text style={styles.groupBadge}>Created by You</Text>
                )}
              </View>

              {/* Chevron Icon */}
              <Ionicons name="chevron-forward" size={24} color="#6A5ACD" style={styles.chevronIcon} />
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
    backgroundColor: "#F5F5F5",
  },
  groupsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  groupDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  groupBadge: {
    marginTop: 6,
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "#4B0082",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  chevronIcon: {
    marginLeft: 12,
  },
});

export default ChatGroups;