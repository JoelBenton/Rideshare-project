import { updateProfile, UserCredential } from "firebase/auth";

export const setUserInformation = async (user: UserCredential, options: { displayName: string }) => {
    try {
        await updateProfile(user.user, options)
        
    } catch (error) {
        console.error('There was an error creating user information:', error)
    }
};