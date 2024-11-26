import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import CustomCard from '@/src/components/CustomCard';
import CustomButton from '@/src/components/CustomButton';
import { useAuth } from '@/src/hooks/useAuth';
import { defaultStyles } from '@/src/constants/themes';
import { emailValidator, passwordValidator, confirmPasswordValidator } from '@/src/validators';

const AuthPage: React.FC = () => {
  const { handleAuth } = useAuth(); // Use the auth hook
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign-Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState('');
  const router = useRouter();

  const clearErrors = () => setErrors(''); // Clear errors on any input change

  const handleFormSubmit = async () => {
    clearErrors(); // Reset error messages on submit

    // Validate email
    try {
      emailValidator.parse(email);
    } catch (e) {
      setErrors(e.errors[0]?.message || 'Invalid email');
      return;
    }

    // Validate password
    try {
      passwordValidator.parse(password);
    } catch (e) {
      setErrors(e.errors[0]?.message || 'Invalid password');
      return;
    }

    if (isSignUp) {
      if (!username.trim()) {
        setErrors('Username is required.');
        return;
      }

      try {
        confirmPasswordValidator(password).parse(confirmPassword);
      } catch (e) {
        setErrors(e.errors[0]?.message || 'Passwords do not match');
        return;
      }

      try {
        const { success, error } = await handleAuth(email, password, username, true);
        if (success) {
          Alert.alert('Success', 'Account created successfully!');
          setIsSignUp(false);
          router.replace('/(tabs)/home'); // Navigate to home after sign-up
        } else {
          setErrors(error);
        }
      } catch (err) {
        setErrors('Authentication failed. Please try again.');
      }
    } else {
      try {
        const { success, error } = await handleAuth(email, password, '', false);
        if (success) {
          Alert.alert('Success', 'Logged in successfully!');
          router.replace('/(tabs)/home'); // Navigate to home after login
        } else {
          setErrors(error);
        }
      } catch (err) {
        setErrors('Authentication failed. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.title, { color: defaultStyles.primaryColor }]}>
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Text>
              <View style={styles.form}>
                <CustomCard
                  title="Work Email"
                  primaryValue={email}
                  onPrimaryChange={(val) => {
                    setEmail(val);
                    clearErrors(); // Clear errors on input change
                  }}
                  primaryPlaceholder="Enter work email"
                />
                {isSignUp && (
                  <CustomCard
                    title="Username"
                    primaryValue={username}
                    onPrimaryChange={(val) => {
                      setUsername(val);
                      clearErrors(); // Clear errors on input change
                    }}
                    primaryPlaceholder="Enter username"
                  />
                )}
                <CustomCard
                  title="Password"
                  primaryValue={password}
                  onPrimaryChange={(val) => {
                    setPassword(val);
                    clearErrors(); // Clear errors on input change
                  }}
                  primaryPlaceholder="Enter password"
                  secureTextEntry
                  showSecureTextEntryToggle
                />
                {isSignUp && (
                  <CustomCard
                    title="Confirm Password"
                    primaryValue={confirmPassword}
                    onPrimaryChange={(val) => {
                      setConfirmPassword(val);
                      clearErrors(); // Clear errors on input change
                    }}
                    primaryPlaceholder="Confirm password"
                    secureTextEntry
                    showSecureTextEntryToggle
                  />
                )}
                {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
              </View>
            </ScrollView>
            <View style={styles.bottomView}>
              <ActivityIndicator animating={false} />
              <CustomButton
                title={isSignUp ? 'Create Account' : 'Log In'}
                onPress={handleFormSubmit}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  clearErrors(); // Clear errors when toggling modes
                }}
                style={styles.toggleContainer}
              >
                <Text style={styles.toggleText}>
                  {isSignUp ? 'Already have an account? Log in' : 'New User? Sign up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 40,
    marginBottom: '10%',
    fontWeight: '800',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    width: '100%',
  },
  bottomView: {
    width: '100%',
    paddingVertical: 20,
  },
  toggleContainer: {
    marginTop: 10,
    alignSelf: 'center',
  },
  toggleText: {
    color: '#00A3FF',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AuthPage;