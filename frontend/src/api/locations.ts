import { Location, createLocation as cLocation } from '@/src/utils/types';
import { fetchWithAuth } from './config';

const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

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