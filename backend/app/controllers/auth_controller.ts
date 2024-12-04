import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import admin from 'firebase-admin'

export default class AuthController {
    // Register or login a user (No Admin Creation allowed, Will be handled by seperate route)
    public async checkUsername({ request, response }: HttpContext) {
        try {
            const { username } = request.all()

            // Check if username exists
            const user = await User.query().where('username', username).first()

            if (!user) {
                return response.ok({ message: 'Username is available' })
            }

            return response.conflict({ error: 'Username already exists' })
        } catch (error) {
            return response.badRequest({ error: 'An error occurred while checking username' })
        }
    }

    // Update user role for Firebase Auth and SQLite
    public async updateUserRole({ request, response }: HttpContext) {
        try {
            const { authUid, role, userUid } = request.all()
            const authUser = await admin.auth().getUser(authUid)
            const firebaseUser = await admin.auth().getUser(userUid)
            const sqliteUser = await User.findOrFail(userUid)

            if (authUser.customClaims?.role !== 'admin') {
                return response.unauthorized({
                    error: 'You are not authorized to update user roles',
                })
            }

            if (sqliteUser.role === role && firebaseUser.customClaims?.role === role) {
                return response.conflict({ message: 'Role is already updated' })
            }

            await admin.auth().setCustomUserClaims(authUid, { role: role })
            sqliteUser.role = role
            await sqliteUser.save()
            return response.ok({ message: 'Role updated successfully' })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'User not found' })
            }
            return response.badRequest({ error: 'An error occurred while updating user role' })
        }
    }
}
