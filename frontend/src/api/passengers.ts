import Constants from "expo-constants";
import { CreatePassenger, UpdatePassenger, OwnerUpdatePassenger } from "../utils/types";
import { fetchWithAuth } from "./config";

const apiEndpoint = Constants.expoConfig?.extra?.backendUrl;

export const fetchTripPassengers = (trip_id: string) => {
    return fetchWithAuth(`${apiEndpoint}/trips/${trip_id}/markers`, { method: 'GET' });
}

export const fetchPassenger = (passenger_id: string) => {
    return fetchWithAuth(`${apiEndpoint}/markers/${passenger_id}`, { method: 'GET' });
}

export const createPassenger = (passenger: CreatePassenger) => {
    return fetchWithAuth(`${apiEndpoint}/trip/${passenger.trip_id}/marker`, {
        method: 'POST',
        body: JSON.stringify(passenger),
    });
}

export const updatePassenger = (passenger: UpdatePassenger) => {
    return fetchWithAuth(`${apiEndpoint}/markers/${passenger.id}`, {
        method: 'PUT',
        body: JSON.stringify(passenger),
    });
}

export const deletePassenger = (passenger_id: string) => {
    return fetchWithAuth(`${apiEndpoint}/markers/${passenger_id}`, { method: 'DELETE' }, false);
}

export const ownerUpdatePassenger = (passenger: OwnerUpdatePassenger) => {
    return fetchWithAuth(`${apiEndpoint}/markers/${passenger.id}/trip-owner-update`, {
        method: 'PUT',
        body: JSON.stringify({
            pending: passenger.pending,
            status: passenger.status,
        }),
    });
}