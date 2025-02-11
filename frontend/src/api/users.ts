import { fetchWithAuth } from './config';

const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchUsers = () =>
    fetchWithAuth(`${apiEndpoint}/users`, { method: 'GET' });

export const updateUserRole = (role: string, userUid: string) =>
    fetchWithAuth(`${apiEndpoint}/update-user-role`, {
        method: 'POST',
        body: JSON.stringify({ role: role, userUid: userUid }),
    });