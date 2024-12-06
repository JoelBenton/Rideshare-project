import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../config/FirebaseConfig';

export const fetchUserRole = () => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.role
            } else {
                return 'user'
            }
        } else {
            return 'user'
        }
    });
    return 'user'
};