import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

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
}
