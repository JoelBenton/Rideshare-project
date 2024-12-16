import { createTrip as cTrip, updateTrip as uTrip } from '@/src/utils/types';
import { fetchWithAuth } from './config';

const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchUpcomingTrips = () =>
    fetchWithAuth(`${apiEndpoint}/trips`, { method: 'GET' });

export const fetchAllTrips = () =>
    fetchWithAuth(`${apiEndpoint}/trips/all`, { method: 'GET' });

export const fetchUpcomingTripsForUser = (user_id: string) =>
    fetchWithAuth(`${apiEndpoint}/user/${user_id}/trips`, { method: 'GET' });

export const fetchAllTripsForUser = (user_id: string) =>
    fetchWithAuth(`${apiEndpoint}/user/${user_id}/trips/all`, { method: 'GET' });

export const fetchTrip = (id: string) =>
    fetchWithAuth(`${apiEndpoint}/trips/${id}`, { method: 'GET' });

export const createTrip = (trip: cTrip) =>
    fetchWithAuth(`${apiEndpoint}/trips`, {
        method: 'POST',
        body: JSON.stringify(trip),
    });

export const updateTrip = (id: string, trip: uTrip) =>
    fetchWithAuth(`${apiEndpoint}/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(trip),
    });

export const deleteTrip = (id: string) =>
    fetchWithAuth(`${apiEndpoint}/trips/${id}`, { method: 'DELETE' }, false);