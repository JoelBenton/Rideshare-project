import { fetchWithAuth } from './config';

const apiEndpoint = process.env.EXPO_PUBLIC_BACKEND_URL;

export const fetchWhitelist = () =>
    fetchWithAuth(`${apiEndpoint}/whitelist`, { method: 'GET' });

export const createWhitelist = (email: string) =>
    fetchWithAuth(`${apiEndpoint}/whitelist`, {
        method: 'POST',
        body: JSON.stringify({ email: email }),
    });

export const deleteWhitelist = (email: string) =>
    fetchWithAuth(`${apiEndpoint}/whitelist`, { 
        method: 'DELETE',
        body: JSON.stringify({ email: email }),
    });

export const checkEmail = (email: string) =>
    fetchWithAuth(`${apiEndpoint}/whitelist/check-email`, {
        method: 'POST',
        body: JSON.stringify({ email: email }),
    });