import admin from 'firebase-admin'
import User from '#models/user'

// Function to retrieve all Firebase Auth users with claims
const getFirebaseAuthUsersWithClaims = async () => {
    const users: { uid: string; username: string; role: string }[] = []

    let result = await admin.auth().listUsers()
    for (const user of result.users) {
        const claims = user.customClaims || {}
        const role = claims.role || 'user' // Default to 'user' if no role claim exists

        // If the role claim doesn't exist, set it to 'user'
        if (!claims.role) {
            await admin.auth().setCustomUserClaims(user.uid, { role: 'user' })
        }

        users.push({ uid: user.uid, username: user.displayName || '', role })
    }

    // Paginate if more users exist
    while (result.pageToken) {
        result = await admin.auth().listUsers(1000, result.pageToken)
        for (const user of result.users) {
            const claims = user.customClaims || {}
            const role = claims.role || 'user'

            if (!claims.role) {
                await admin.auth().setCustomUserClaims(user.uid, { role: 'user' })
            }

            users.push({ uid: user.uid, username: user.displayName || '', role })
        }
    }

    return users
}

// Function to sync users from Firebase Auth to SQLite
export const syncUsersWithSQLite = async () => {
    try {
        const firebaseUsers = await getFirebaseAuthUsersWithClaims()

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
        sqliteUsers.forEach((user) => {
            if (!firebaseUids.includes(user.firebase_uid)) {
                // User exists in SQLite but not Firebase, so remove from SQLite
                user.delete()
            }
        })

        // Step 4: Add or update users in SQLite
        firebaseUsers.forEach((firebaseUser) => {
            const existingUser = sqliteUsers.find((user) => user.firebase_uid === firebaseUser.uid)
            if (existingUser) {
                // Update user role if needed
                if (existingUser.role !== firebaseUser.role) {
                    existingUser.username = firebaseUser.username
                    existingUser.role = firebaseUser.role
                    existingUser.save()
                }
            } else {
                // Create new user
                User.create({
                    firebase_uid: firebaseUser.uid,
                    username: firebaseUser.username || '',
                    role: firebaseUser.role,
                })
            }
        })

        return { success: true }
    } catch (error) {
        return { success: false, error: error }
    }
}
