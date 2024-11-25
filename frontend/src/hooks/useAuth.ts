// src/hooks/useAuth.ts
import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import { setUserInformation } from '@/src/utils/auth';

export const useAuth = () => {
  const [error, setError] = useState('')
  
  const handleAuth = async (email: string, password: string, username: string, isSignUp: boolean) => {
    try {
      let userCredential: UserCredential | null = null;

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
          setError('Invalid email or password. Please try again.');
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }
      
        if (isSignUp && error.code === 'auth/email-already-in-use') {
          setError('Email already in use. Please use a different email.');
          return { success: false, error: 'Email already in use. Please use a different email.' };
        }
      
        setError('Authentication error: ' + error.message);
        return { success: false, error: 'Authentication error: ' + error.message };
      }

      // Get the Firebase ID token (JWT)
      const idToken = await userCredential.user.getIdToken();

      // Send the ID token and username to the backend for registration/login
      const response = await fetch(`${process.env.BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      console.log(response)

      if (!response.ok) {
        // Handle failure and delete the newly created user if registration fails
        if (userCredential && !userCredential.user.emailVerified) {
          await userCredential.user.delete();
        }
        setError('Authentication failed. Please try again.');
        return { success: false, error: 'Authentication failed. Please try again.' };
      }

      return { success: true };
    } catch (error) {
      setError('Authentication failed. Please try again.');
      return { success: false, error: error.message };
    }
  }

  return { handleAuth, error };
}