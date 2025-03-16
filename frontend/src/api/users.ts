import Constants from 'expo-constants';
import { fetchWithAuth } from './config';

const apiEndpoint = Constants.expoConfig?.extra?.backendUrl;

export const fetchUsers = () =>
    fetchWithAuth(`${apiEndpoint}/users`, { method: 'GET' });

export const updateUserRole = (role: string, userUid: string) =>
    fetchWithAuth(`${apiEndpoint}/update-user-role`, {
        method: 'POST',
        body: JSON.stringify({ role: role, userUid: userUid }),
    });