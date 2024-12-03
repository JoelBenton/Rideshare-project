import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocation, deleteLocation, fetchLocation, fetchLocations, updateLocation } from '../api/locations';
import type { createLocation as cLocation, Location } from '../utils/types';
import { Alert } from 'react-native';

const QUERY_KEYS = {
    LOCATIONS: ['locations'],
    LOCATION: (id: number) => ['location', id],
};

export const useLocations = () => {
    return useQuery({
        queryKey: QUERY_KEYS.LOCATIONS,
        queryFn: fetchLocations,
    });
}

export const useLocation = (id: number) => {
    return useQuery({
        queryKey: QUERY_KEYS.LOCATION(id),
        queryFn: () => fetchLocation(id.toString()),
        enabled: !!id
    });
}

export const useCreateLocation = (location: cLocation) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => createLocation(location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS });
            return true;
        },
        onError: () => {
            return false;
        }
    });
}

export const useUpdateLocation = (id: number, location: Location) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateLocation(id.toString(), location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATION(id) });
            Alert.alert('Success', 'Location updated successfully.');
            return true;
        },
        onError: () => {
            Alert.alert('Error', 'Failed to update location.');
            return false;
        }
    });
}

export const useDeleteLocation = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteLocation(id.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS });
            return true;
        },
        onError: () => {
            return false;
        }
    });
}