// src/hooks/useAuth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import { setUserInformation } from '@/src/utils/auth';
import { Platform } from 'react-native';

export const useAuth = () => {
  const handleAuth = async (email: string, password: string, username: string, isSignUp: boolean) => {
    try {
      let userCredential: UserCredential | null = null;

      const apiEndpoint = Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_BACKEND_URL_IOS : process.env.EXPO_PUBLIC_BACKEND_URL_ANDROID;

      // Try to sign in with email and password
      try {
        if (!isSignUp) {
          // Sign-in logic
          userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        } else {
          // Sign-up logic
          userCredential =await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      
          // Set user information (username)
          await setUserInformation(userCredential, { displayName: username });
        }
      } catch (error) {
        // Handle errors for both sign-in and sign-up
        if (!isSignUp && error.code === 'auth/invalid-credential') {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }
      
        if (isSignUp && error.code === 'auth/email-already-in-use') {
          return { success: false, error: 'Email already in use. Please use a different email.' };
        }

        return { success: false, error: 'Authentication error: ' + error.message };
      }

      // Get the Firebase ID token (JWT)
      const idToken = await userCredential.user.getIdToken();

      if (!isSignUp) {
        username = userCredential.user.displayName;
      }

      // Send the ID token and username to the backend for registration/login
      const response = await fetch(`${apiEndpoint}/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        // Handle failure and delete the newly created user if registration fails
        if (isSignUp && userCredential && !userCredential.user.emailVerified) {
          await userCredential.user.delete();
        }
        return { success: false, error: 'Authentication failed. Please try again.' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  }

  return { handleAuth };
}