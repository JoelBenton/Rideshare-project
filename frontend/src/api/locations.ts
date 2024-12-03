import { Location, createLocation as cLocation } from '@/src/utils/types';
import { FIREBASE_AUTH } from '@/src/config/FirebaseConfig';

const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

const fetchWithAuth = async (url: string, options: RequestInit, json = true) => {
    const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
    };
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch');
    }

    if (json) {
        return response.json();
    } else {
        return true;
    }
};

export const fetchLocations = () =>
    fetchWithAuth(`${apiEndpoint}/locations`, { method: 'GET' });

export const fetchLocation = (id: string) =>
    fetchWithAuth(`${apiEndpoint}/locations/${id}`, { method: 'GET' });

export const createLocation = (location: cLocation) =>
    fetchWithAuth(`${apiEndpoint}/locations`, {
        method: 'POST',
        body: JSON.stringify(location),
    });

export const updateLocation = (id: string, location: Location) =>
    fetchWithAuth(`${apiEndpoint}/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(location),
    });

export const deleteLocation = (id: string) =>
    fetchWithAuth(`${apiEndpoint}/locations/${id}`, { method: 'DELETE' }, false);