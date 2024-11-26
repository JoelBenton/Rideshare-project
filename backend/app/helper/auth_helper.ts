import admin from 'firebase-admin'
import User from '#models/user'

// Function to retrieve all Firebase Auth users
const getFirebaseAuthUsers = async () => {
    const users: { uid: string; username: string }[] = []

    let result = await admin.auth().listUsers()
    users.push(...result.users.map((user) => ({ uid: user.uid, username: user.displayName || '' })))

    // Paginate if more users exist
    while (result.pageToken) {
        result = await admin.auth().listUsers(1000, result.pageToken)
        users.push(
            ...result.users.map((user) => ({ uid: user.uid, username: user.displayName || '' }))
        )
    }

    return users
}

// Function to sync users from Firebase Auth to SQLite
export const syncUsersWithSQLite = async () => {
    try {
        const firebaseUsers = await getFirebaseAuthUsers()

        // Step 1: Get all users from SQLite and Firebase
        const sqliteUsers = await User.all()
        const firebaseUids = firebaseUsers.map((user) => user.uid)

        // Step 2: Check if both are already synced. If so, return
        const sqliteUids = sqliteUsers.map((user) => user.firebase_uid)

        if (
            firebaseUids.length === sqliteUids.length &&
            firebaseUids.every((uid) => sqliteUids.includes(uid))
        ) {
            return { success: true }
        }

        // Step 3: Remove users in SQLite but not in Firebase Auth
        for (const sqliteUser of sqliteUsers) {
            if (!firebaseUids.includes(sqliteUser.firebase_uid)) {
                // User exists in SQLite but not Firebase, so remove from SQLite
                await sqliteUser.delete()
            }
        }

        // Step 4: Add or update users in SQLite
        for (const firebaseUser of firebaseUsers) {
            const existingUser = await User.findBy('firebase_uid', firebaseUser.uid)

            if (!existingUser) {
                // User doesn't exist in SQLite, create a new user
                await User.create({
                    firebase_uid: firebaseUser.uid,
                    username: firebaseUser.username || '',
                })
            }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error }
    }
}
