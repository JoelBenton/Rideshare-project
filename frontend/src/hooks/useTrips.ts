import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip, deleteTrip, fetchTrip, fetchAllTrips, fetchUpcomingTrips, fetchAllTripsForUser, fetchUpcomingTripsForUser, updateTrip } from '../api/trips';
import type { createTrip as cTrip, updateTrip as uTrip } from '../utils/types';
import { Alert } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';


export const TRIP_QUERY_KEYS = {
    TRIPS: ['trips'], // All Trips
    UPCOMING_TRIPS: ['upcoming-trips'], // All Upcoming Trips
    UPCOMING_TRIPS_FOR_USER: (user_id: string) => ['upcoming-trips', user_id], // All Upcoming Trips for User
    ALL_TRIPS_FOR_USER: (user_id: string) => ['all-trips', user_id], // All Trips for User
    TRIP: (id: string) => ['trip', id], // Single Trip
};

export const useTrips = () => {
    return useQuery({
        queryKey: TRIP_QUERY_KEYS.TRIPS,
        queryFn: fetchAllTrips,
    });
}

export const useUpcomingTrips = () => {
    return useQuery({
        queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS,
        queryFn: fetchUpcomingTrips,
    });
}

export const useUpcomingTripsForUser = (userId: string) => {
    return useQuery({
        queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId),
        queryFn: () => fetchUpcomingTripsForUser(userId),
        enabled: !!userId
    });
}

export const useAllTripsForUser = (userId: string) => {
    return useQuery({
        queryKey: TRIP_QUERY_KEYS.ALL_TRIPS_FOR_USER(userId),
        queryFn: () => fetchAllTripsForUser(userId),
        enabled: !!userId
    });
}

export const useTrip = (id: string) => {
    return useQuery({
        queryKey: TRIP_QUERY_KEYS.TRIP(id),
        queryFn: () => fetchTrip(id.toString()),
        enabled: !!id
    });
}

export const useCreateTrip = (trip: cTrip, userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createTrip(trip),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            return true;
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to Create Trip.' + error);
            return false;
        }
    });
}

export const useUpdateTrip = (id: string, trip: uTrip, userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateTrip(id, trip),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIP(id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            Alert.alert('Success', 'Trip updated successfully.');
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to create Trip.');
            return false;
        }
    });
}

export const useDeleteTrip = (id: string, userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteTrip(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.ALL_TRIPS_FOR_USER(userId) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(userId) });
            return true;
        },
        onError: () => {
            return false;
        }
    });
}