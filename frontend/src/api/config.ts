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
        let errorMessage = 'Failed to fetch';
        let errorCode = null;

        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            errorCode = errorData.error || null; // Capture the backend error code
        } catch {}

        const error = new Error(errorMessage) as Error & { code?: string };
        if (errorCode) error.code = errorCode; // Attach error code to the error object
        throw error;
    }

    return json ? await response.json() : true;
};