import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip, deleteTrip, fetchTrip, fetchAllTrips, fetchUpcomingTrips, fetchAllTripsForUser, fetchUpcomingTripsForUser, updateTrip } from '../api/trips';
import type { createTrip as cTrip, updateTrip as uTrip } from '../utils/types';
import { Alert } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';


const userId = FIREBASE_AUTH.currentUser?.uid

const QUERY_KEYS = {
    TRIPS: ['trips'], // All Trips
    UPCOMING_TRIPS: ['upcoming-trips'], // All Upcoming Trips
    UPCOMING_TRIPS_FOR_USER: (user_id: string) => ['upcoming-trips', user_id], // All Upcoming Trips for User
    ALL_TRIPS_FOR_USER: (user_id: string) => ['all-trips', user_id], // All Trips for User
    TRIP: (id: number) => ['trip', id], // Single Trip
};

export const useTrips = () => {
    return useQuery({
        queryKey: QUERY_KEYS.TRIPS,
        queryFn: fetchAllTrips,
    });
}

export const useUpcomingTrips = () => {
    return useQuery({
        queryKey: QUERY_KEYS.UPCOMING_TRIPS,
        queryFn: fetchUpcomingTrips,
    });
}

export const useUpcomingTripsForUser = () => {
    return useQuery({
        queryKey: QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId),
        queryFn: () => fetchUpcomingTripsForUser(userId),
        enabled: !!userId
    });
}

export const useAllTripsForUser = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ALL_TRIPS_FOR_USER(userId),
        queryFn: () => fetchAllTripsForUser(userId),
        enabled: !!userId
    });
}

export const useTrip = (id: number) => {
    return useQuery({
        queryKey: QUERY_KEYS.TRIP(id),
        queryFn: () => fetchTrip(id.toString()),
        enabled: !!id
    });
}

export const useCreateTrip = (trip: cTrip) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createTrip(trip),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to update location.');
            return false;
        }
    });
}

export const useUpdateTrip = (id: number, trip: uTrip) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateTrip(id.toString(), trip),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIP(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            Alert.alert('Success', 'Trip updated successfully.');
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to update location.');
            return false;
        }
    });
}

export const useDeleteTrip = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteTrip(id.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            return true;
        },
        onError: () => {
            return false;
        }
    });
}