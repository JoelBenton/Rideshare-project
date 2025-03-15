import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';
import { setUserInformation } from '@/src/utils/auth';
import { checkEmail } from '@/src/api/whitelist';

export const useAuth = () => {
  const handleAuth = async (email: string, password: string, username: string, isSignUp: boolean, role: string = "user") => {
    try {
      let userCredential: UserCredential | null = null;
      const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

      // Step 1: Validate username and email on the backend if signing up
      if (isSignUp) {
        const validationResponse = await fetch(`${apiEndpoint}/check-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username }),
        });

        if (!validationResponse.ok) {
          const { error } = await validationResponse.json();
          return { success: false, error };
        }
      }

      // Step 2: Firebase Authentication (sign-in or sign-up)
      try {
        if (!isSignUp) {
          // Sign-in logic
          userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        } else {
            
          await checkEmail(email);

          // Sign-up logic
          userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
          
          // Set user information (username)
          await setUserInformation(userCredential, { displayName: username });
        }
      } catch (error) {
        if (!isSignUp && error.code === 'auth/invalid-credential') {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }

        if (isSignUp && error.code === 'auth/email-already-in-use') {
          return { success: false, error: 'Email already in use. Please use a different email.' };
        }

        if (isSignUp && error.message === 'whitelist/email-not-found') {
          return { success : false, error: 'Email not found in whitelist' };
        }

        return { success: false, error: 'Authentication error: ' + error.message };
      }

      // Step 3: Get the Firebase ID token (JWT)
      const idToken = await userCredential.user.getIdToken();

      // Step 4: Sync database with the backend
      await fetch(`${apiEndpoint}/sync-database`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      return { success: true };
    } catch (error) {
      if (isSignUp && FIREBASE_AUTH.currentUser) {
        await FIREBASE_AUTH.signOut();
        return { success: false, error: 'User Created Successfully. However unexpected error occurred, Please try logging in!' };
      }
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  };

  return { handleAuth };
};
