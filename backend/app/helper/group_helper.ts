import admin from 'firebase-admin'

export const startGroup = async (
    creator_uid: string,
    users_uid: string[],
    group_name: string,
    trip_id: number,
    date_of_trip: string
) => {
    try {
        const group = await admin.firestore().collection('groups').add({
            name: group_name,
            trip_id: trip_id,
            date_of_trip: date_of_trip,
            creator: creator_uid,
            users: users_uid,
        })

        return { success: true, group: group }
    } catch (error) {
        return { success: false, error: error }
    }
}

export const addUsersToGroup = async (group_id: string, users_uid: string[]) => {
    try {
        const groupRef = admin.firestore().collection('groups').doc(group_id)
        await groupRef.update({
            users: admin.firestore.FieldValue.arrayUnion(...users_uid),
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error }
    }
}

export const removeUsersFromGroup = async (group_id: string, users_uid: string[]) => {
    try {
        const groupRef = admin.firestore().collection('groups').doc(group_id)
        await groupRef.update({
            users: admin.firestore.FieldValue.arrayRemove(...users_uid),
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error }
    }
}

export const deleteGroup = async (group_id: string) => {
    try {
        await admin.firestore().collection('groups').doc(group_id).delete()
        return { success: true }
    } catch (error) {
        return { success: false, error: error }
    }
}

export const getGroup = async (group_id: string) => {
    try {
        const group = await admin.firestore().collection('groups').doc(group_id).get()
        return { success: true, group: group.data() }
    } catch (error) {
        return { success: false, error: error }
    }
}

export const getAllGroups = async () => {
    try {
        const groups = await admin.firestore().collection('groups').get()
        return { success: true, groups: groups.docs.map((doc) => doc.data()) }
    } catch (error) {
        return { success: false, error: error }
    }
}
