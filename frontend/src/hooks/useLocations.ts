import type { createLocation as cLocation, Location } from '@/src/utils/types';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { signOut } from 'firebase/auth';


const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

export const getLocations = async () => {
    try {

        const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
        const response = await fetch(`${apiEndpoint}/locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                Alert.alert("Session expired", "Please login again.");
                await signOut(FIREBASE_AUTH);
                router.push('/(auth)/login');
            }
            return { success: false };
        }

        const data = await response.json();
        return { success: true, data: data.data as Location[] };
    } catch (error) {
        return { success: false };
    }
};

export const createLocations = async (location: cLocation) => {
    try {
        const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
        const response = await fetch(`${apiEndpoint}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(location),
        });

        if (!response.ok) {
            if (response.status === 401) {
                Alert.alert("Session expired", "Please login again.");
                await signOut(FIREBASE_AUTH);
                router.push('/(auth)/login');
            }
            return { success: false };
        }

        const data = await response.json();
        return { success: true, data: data as Location };
    } catch (error) {
        return { success: false };
    }
};

export const getLocation = async (location_id: string) => {
    try {
        const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
        const response = await fetch(`${apiEndpoint}/locations/${location_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                Alert.alert("Session expired", "Please login again.");
                await signOut(FIREBASE_AUTH);
                router.push('/(auth)/login');
            }
            return { success: false };
        }

        const data = await response.json();
        return { success: true, data: data.data as Location };
    } catch (error) {
        return { success: false };
    }
};

export const updateLocation = async (location_id: string, location: Location) => {
    try {
        const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
        const response = await fetch(`${apiEndpoint}/locations/${location_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(location),
        });

        if (!response.ok) {
            if (response.status === 401) {
                Alert.alert("Session expired", "Please login again.");
                await signOut(FIREBASE_AUTH);
                router.push('/(auth)/login');
            }
            return { success: false };
        }

        const data = await response.json();
        return { success: true, data: data.data as Location };
    } catch (error) {
        return { success: false };
    }
};