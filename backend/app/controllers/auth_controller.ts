import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { syncUsersWithSQLite } from '../helper/auth_helper.js'

export default class AuthController {
    // Register or login a user (No Admin Creation allowed, Will be handled by seperate route)
    public async registerOrLogin({ request, response }: HttpContext) {
        const payload = request.all()
        const uid = payload.authUid
        const username = payload.username

        await syncUsersWithSQLite()

        try {
            // Check if user already exists in the database
            let user = await User.findBy('firebase_uid', uid)

            if (!user) {
                // Check if user with the same username already exists
                const existingUser = await User.findBy('username', username)

                if (existingUser) {
                    return response.conflict({ error: 'auth/username-taken' })
                }

                // If user does not exist, create a new user
                user = await User.create({
                    firebase_uid: uid,
                    username: username, // Use the provided username
                })
            }

            // Return user data and the token
            return response.created({})
        } catch (error) {
            return response.internalServerError({
                error: 'auth/processing-error',
            })
        }
    }
}
