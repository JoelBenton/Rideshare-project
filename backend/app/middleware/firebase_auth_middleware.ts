import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import admin from 'firebase-admin'
import { syncUsersWithSQLite } from '../helper/auth_helper.js'

export default class FirebaseAuthMiddleware {
    async handle(ctx: HttpContext, next: NextFn) {
        try {
            const token = ctx.request.header('Authorization')?.replace('Bearer ', '')
            if (!token) {
                return ctx.response.unauthorized({ error: 'auth/token-not-found' })
            }
            const decodedToken = await admin.auth().verifyIdToken(token)

            const { uid } = decodedToken

            ctx.request.all().authUid = uid
            await syncUsersWithSQLite()
            await next()
        } catch (error) {
            return ctx.response.unauthorized({ error: 'auth/invalid-token' })
        }
    }
}
