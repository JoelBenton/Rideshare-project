import type { HttpContext } from '@adonisjs/core/http'
import admin from 'firebase-admin'
import User from '#models/user'

export default class AuthController {
    // Register or login a user (No Admin Creation allowed, Will be handled by seperate route)
    public async registerOrLogin({ request, response }: HttpContext) {
        console.log('auth controller hit')
        const token = request.header('Authorization')?.replace('Bearer ', '')
        const username = request.only(['username'])

        if (!token) {
            return response.unauthorized({ error: 'auth/token-not-found' })
        }

        try {
            // Verify the Firebase ID token
            const decodedToken = await admin.auth().verifyIdToken(token)
            const { uid } = decodedToken

            // Check if user already exists in the database
            let user = await User.findBy('firebase_uid', uid)

            if (!user) {
                // Check if user with the same username already exists
                const existingUser = await User.findBy('username', username.username)

                if (existingUser) {
                    return response.unauthorized({ error: 'auth/username-taken' })
                }

                // If user does not exist, create a new user
                user = await User.create({
                    firebase_uid: uid,
                    username: username.username, // Use the provided username
                })
            }

            // Return user data and the token
            return response.json({
                user: {
                    uid: user.firebase_uid,
                    backend_uid: user.id,
                    username: user.username,
                },
            })
        } catch (error) {
            return response.unauthorized({
                error: 'auth/processing-error',
            })
        }
    }
}
