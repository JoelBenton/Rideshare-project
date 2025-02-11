import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import CustomCard from '@/src/components/CustomCard';
import CustomButton from '@/src/components/CustomButton';
import { defaultStyles } from '@/src/constants/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { passwordValidator } from '@/src/validators/passwordValidator';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const changePassword: React.FC = () => {
    
    const router = useRouter()

    const currentUser = useAuth().user;
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // State for error messages
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    
    const handleUpdatePassword = async () => {
        let valid = true;
        setLoading(true);
        
        // Clear previous error messages
        setCurrentPasswordError('');
        setPasswordError('');
        setConfirmPasswordError('');
        
        // Validate password
        try {
            passwordValidator.parse(password);
          } catch (e) {
            setPasswordError(e.errors.join(' '));
            valid = false;
          }
        
        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError('Confirm Password is required.');
            valid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('New Passwords do not match.');
            valid = false;
        }

        const credentials = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );

        reauthenticateWithCredential(currentUser, credentials)
        .catch((error) => {
            valid = false;
            if (error.message.includes('auth/invalid-credential')) {
                setCurrentPasswordError('Password Incorrect')
            } else {
                setCurrentPasswordError(error.message)
            }
        })

        setLoading(false);
        
        if (!valid) {
            return
        };

        await updatePassword(currentUser, password)
        Alert.alert('Password Updated');
        router.back();


    };
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Change Password</Text>
                <View style={styles.form}>                    
                    <CustomCard
                    title="Current Password"
                    primaryValue={currentPassword}
                    onPrimaryChange={setCurrentPassword}
                    primaryPlaceholder='Enter password'
                    secureTextEntry={true}
                    showSecureTextEntryToggle={true}
                    />
                    {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
                    <CustomCard
                        title="New Password"
                        primaryValue={password}
                        onPrimaryChange={setPassword}
                        primaryPlaceholder='Enter new password'
                        secureTextEntry={true}
                        showSecureTextEntryToggle={true}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    <CustomCard
                        title="Confirm Password"
                        primaryValue={confirmPassword}
                        onPrimaryChange={setConfirmPassword}
                        primaryPlaceholder='Confirm password'
                        secureTextEntry={true}
                        showSecureTextEntryToggle={true}
                    />
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>
                    <View style={styles.bottomView}>
                        { loading ? <ActivityIndicator/> : 
                            <>
                                <CustomButton title='Update Password' onPress={handleUpdatePassword} />
                                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                            </>
                        }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Ensure content starts at the top
    },
    title: {
        color: defaultStyles.primaryColor,
        fontSize: 40,
        marginBottom: '10%',
        fontFamily: defaultStyles.fontFamily,
        fontWeight: '800', // Extra Bold
        textAlign: 'center',
    },
    form: {
        flex: 1,
        width: '100%',
    },
    bottomView: {
        marginTop: 20, // Adds space between form and button
        width: '100%',
    },
    back: {
        marginTop: 10,
        alignSelf: 'center'
    },
    backText: {
        color: '#00A3FF',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Makes the text look like a link
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginVertical: 5,
        marginHorizontal: 10,
    },
});

export default changePassword;