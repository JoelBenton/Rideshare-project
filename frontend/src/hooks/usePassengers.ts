import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPassenger, fetchTripPassengers, createPassenger, updatePassenger, deletePassenger, ownerUpdatePassenger } from '../api/passengers';
import type { Passenger, CreatePassenger, UpdatePassenger, OwnerUpdatePassenger, TripPassengerFormat } from '../utils/types';
import { Alert } from 'react-native';
import { TRIP_QUERY_KEYS } from './useTrips';


export const PASSENGER_QUERY_KEYS = {
    PASSENGER: (id: string) => ['passenger', id],
    TRIP_PASSENGERS: (trip_id: string) => ['tripPassengers', trip_id],
};

export const usePassenger = (id: string) => {
    return useQuery({
        queryKey: PASSENGER_QUERY_KEYS.PASSENGER(id),
        queryFn: () => fetchPassenger(id.toString()),
        enabled: !!id
    });
}

export const useTripPassengers = (trip_id: string) => {
    return useQuery({
        queryKey: PASSENGER_QUERY_KEYS.TRIP_PASSENGERS(trip_id),
        queryFn: () => fetchTripPassengers(trip_id.toString()),
        enabled: !!trip_id
    });
}

export const useCreatePassenger = (passenger: CreatePassenger) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createPassenger(passenger),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.TRIP_PASSENGERS(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIP(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(passenger.user_uid) });
            return true;
        },
        onError: (error) => {
            console.log('Error', error instanceof Error ? error.message : 'Failed to join trip.')
            return false;
        }
    });
}

export const useUpdatePassenger = (passenger: UpdatePassenger) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updatePassenger(passenger),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.PASSENGER(passenger.id) });
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.TRIP_PASSENGERS(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIP(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(passenger.user_id) });
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to update passenger.');
            return false;
        }
    });
}

export const useDeletePassenger = (passenger: Passenger) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deletePassenger(passenger.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.PASSENGER(passenger.id) });
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.TRIP_PASSENGERS(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS }); 
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIP(passenger.trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(passenger.user_id) });
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to delete passenger.');
            return false;
        }
    });
}

export const useOwnerUpdatePassenger = (passenger: TripPassengerFormat, trip_id: string, status: string = null, pending: boolean = null) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => ownerUpdatePassenger({id: String(passenger.id), status, pending}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.PASSENGER(String(passenger.id)) });
            queryClient.invalidateQueries({ queryKey: PASSENGER_QUERY_KEYS.TRIP_PASSENGERS(trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.TRIP(trip_id) });
            queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEYS.UPCOMING_TRIPS_FOR_USER(passenger.driver.id) });
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to update passenger.');
            return false;
        }
    });
}
