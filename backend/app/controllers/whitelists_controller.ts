import type { HttpContext } from '@adonisjs/core/http'
import Whitelist from '#models/whitelist'

export default class WhitelistsController {
    public async checkEmail({ request, response }: HttpContext) {
        try {
            const { email } = request.all()
            const emailExists = await Whitelist.query()
                .whereRaw('LOWER(email) = ?', [email.toLowerCase()])
                .first()

            if (emailExists) {
                return response.ok({ message: 'Email exists in whitelist' })
            }

            return response.notFound({ error: 'whitelist/email-not-found' })
        } catch (error) {
            return response.internalServerError({ error: 'whitelist/processing-error' })
        }
    }

    public async addEmail({ request, response }: HttpContext) {
        try {
            const { email } = request.all()
            const emailExists = await Whitelist.query()
                .whereRaw('LOWER(email) = ?', [email.toLowerCase()])
                .first()

            if (emailExists) {
                return response.conflict({ error: 'whitelist/email-already-exists' })
            }

            await Whitelist.create({ email })
            return response.created({ message: 'Email added to whitelist' })
        } catch (error) {
            return response.internalServerError({ error: 'whitelist/processing-error' })
        }
    }

    public async removeEmail({ request, response }: HttpContext) {
        try {
            const { email } = request.all()
            const emailToRemove = await Whitelist.query().where('email', email).first()

            if (!emailToRemove) {
                return response.notFound({ error: 'whitelist/email-not-found' })
            }

            await emailToRemove.delete()
            return response.ok({ message: 'Email removed from whitelist' })
        } catch (error) {
            return response.internalServerError({ error: 'whitelist/processing-error' })
        }
    }

    public async getWhitelist({ response }: HttpContext) {
        try {
            const whitelist = await Whitelist.query()
            return response.ok(whitelist)
        } catch (error) {
            return response.internalServerError({ error: 'whitelist/processing-error' })
        }
    }
}
