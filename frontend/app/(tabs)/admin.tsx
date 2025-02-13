import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/src/components/CustomButton';
import { fetchWhitelist, createWhitelist, deleteWhitelist, checkEmail } from '@/src/api/whitelist';
import { fetchUsers, updateUserRole } from '@/src/api/users';
import { User } from '@/src/utils/types';
import { useAuth } from "@/src/context/AuthContext";

const AdminWhitelistScreen: React.FC = () => {
    const [whitelist, setWhitelist] = useState<{ email: string }[]>([]);
    const [email, setEmail] = useState('');
    const [checkEmailInput, setCheckEmailInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkEmailData, setCheckEmailData] = useState<{ message: string } | null>(null);
    const [checkingAddEmail, setCheckingAddEmail] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [whitelistSearchQuery, setWhitelistSearchQuery] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        loadWhitelist();
        loadUsers();
    }, []);

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        let data = await fetchUsers();
        data = data.data.filter((user: User) => user.firebaseUid != currentUser?.uid);
        setUsers(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoadingUsers(false);
      }
    }

    const loadWhitelist = async () => {
        setIsLoading(true);
        try {
            const data = await fetchWhitelist();
            setWhitelist(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter an email');
            return;
        }

        setCheckingAddEmail(true);

        try {
            await createWhitelist(email);
            Alert.alert('Success', 'Email added to whitelist');
            setEmail('');
            await loadWhitelist();
        } catch (error) {
            if (error.message === 'whitelist/email-already-exists') {
                Alert.alert('Error', 'Email already exists in whitelist');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setCheckingAddEmail(false);
        }
    };

    const handleRemoveEmail = async (emailToRemove: string) => {
        try {
            await deleteWhitelist(emailToRemove);
            Alert.alert('Success', 'Email removed from whitelist');
            loadWhitelist();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleCheckEmail = async () => {
        if (!checkEmailInput) return Alert.alert('Error', 'Please enter an email');

        setCheckingEmail(true);

        try {
            const data = await checkEmail(checkEmailInput);
            setCheckEmailData(data);
        } catch (error) {
            if (error.message === 'whitelist/email-not-found') {
                setCheckEmailData({ message: 'Email not found in whitelist' });
            } else {
                setCheckEmailData({ message: 'Error checking email' });
                Alert.alert('Error', error.message);
            }
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleCheckEmailValueChange = (value: string) => {
        setCheckEmailInput(value);
        setCheckEmailData(null);
    };

    const toggleAdminStatus = async (userUid: string, currentStatus: boolean) => {
        try {
            await updateUserRole(currentStatus ? 'user' : 'admin', userUid );
            Alert.alert('Success', `User ${email} is now ${!currentStatus ? 'an Admin' : 'a regular user'}`);
            loadUsers();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredWhitelist = whitelist.filter((item) => item.email.toLowerCase().includes(whitelistSearchQuery.toLowerCase()));

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#4B0082', '#6a0dad']} style={styles.header}>
                <Text style={styles.headerText}>Admin Panel</Text>
                <Text style={styles.headerSubText}>User and Email Whitelist Management</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>

              {/* User Management Section */}
              <View style={styles.card}>
                    <Text style={styles.sectionTitle}>User Management</Text>
                    <TextInput
                        placeholder="Search users by username"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.input}
                    />
                    {loadingUsers ? (
                        <ActivityIndicator size="large" color="#4B0082" />
                    ) : filteredUsers.length > 0 ? (
                      <View style={styles.whitelistContainer}>
                        <ScrollView style={styles.whitelistScrollView}>
                            {filteredUsers.map((user) => (
                                <View key={user.username} style={styles.whitelistItem}>
                                    <Text style={styles.emailText}>{user.username}</Text>
                                    <TouchableOpacity
                                        onPress={() => toggleAdminStatus(user.firebaseUid, user.role === 'admin')}
                                        style={[styles.adminToggleButton, user.role === 'admin' ? styles.adminActive : styles.adminInactive]}
                                    >
                                        <Text style={styles.buttonText}>{user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                      </View>
                    ) : (
                        <Text style={styles.noWhitelistText}>No users found.</Text>
                    )
                    }
                </View>

                {/* Whitelist Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Whitelisted Emails</Text>
                    <TextInput
                        placeholder="Search by email"
                        value={whitelistSearchQuery}
                        onChangeText={setWhitelistSearchQuery}
                        style={styles.input}
                    />
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4B0082" />
                    ) : filteredWhitelist.length > 0 ? (
                        <View style={styles.whitelistContainer}>
                            <ScrollView style={styles.whitelistScrollView}>
                                {filteredWhitelist.map((item) => (
                                    <View key={item.email} style={styles.whitelistItem}>
                                        <Text style={styles.emailText}>{item.email}</Text>
                                        <GradientButton title="Remove" onPress={() => handleRemoveEmail(item.email)} />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <Text style={styles.noWhitelistText}>No emails whitelisted.</Text>
                    )}
                </View>

                {/* Add Email Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Add to Whitelist</Text>
                    <TextInput
                        placeholder="Enter email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <CustomButton title="Add Email" onPress={handleAddEmail} disabled={checkingAddEmail} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

/** Custom Gradient Button for Remove **/
const GradientButton: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.gradientButtonContainer}>
        <LinearGradient colors={['#FF3D3D', '#D32F2F']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingVertical: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubText: {
        fontSize: 14,
        color: '#E0E0E0',
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B0082',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#4B0082',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#FFF',
    },
    whitelistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    emailText: {
        fontSize: 16,
        color: '#333',
    },
    gradientButtonContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultText: {
      fontSize: 16,
      marginTop: 10,
      color: '#4B0082',
      textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noWhitelistText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    whitelistContainer: {
      maxHeight: 200,
    },
    whitelistScrollView: {
        flexGrow: 0,
    },
    adminToggleButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    adminActive: {
        backgroundColor: '#D32F2F',
    },
    adminInactive: {
        backgroundColor: '#4B0082',
    },
});

export default AdminWhitelistScreen;