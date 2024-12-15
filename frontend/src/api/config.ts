import { FIREBASE_AUTH } from "../config/FirebaseConfig";

export const fetchWithAuth = async (url: string, options: RequestInit, json = true) => {
    const idToken = await FIREBASE_AUTH.currentUser?.getIdToken();
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
    };
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch');
    }

    if (json) {
        return response.json();
    } else {
        return true;
    }
};