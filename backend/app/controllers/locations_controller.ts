import type { HttpContext } from '@adonisjs/core/http'
import Locations from '#models/locations'
import { locationSchema } from '#validators/location'

export default class LocationsController {
    /**
     * Display a list of resource
     *
     * Will show all global and user specific locations
     */
    async index({ request, response }: HttpContext) {
        try {
            const uid = request.all().authUid
            const locations = await Locations.query()
                .where('creator_uid', uid)
                .orWhere('public', true)

            return response.ok({ data: locations })
        } catch (error) {
            return response.internalServerError({ error: 'locations/processing-error' })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response }: HttpContext) {
        try {
            let payload = request.all()
            const { authUid, ...filteredPayload } = payload
            const uid: string = payload.authUid

            const validatedPayload = await locationSchema.validate(filteredPayload)

            const location = await Locations.create({
                creator_uid: uid,
                public: validatedPayload.public ?? false,
                name: validatedPayload.name,
                address: validatedPayload.address,
                latitude: validatedPayload.latitude,
                longitude: validatedPayload.longitude,
            })

            return response.created({ data: location })
        } catch (error) {
            console.log(error)
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'locations/validation-error' })
            } else {
                return response.internalServerError({ error: 'locations/processing-error' })
            }
        }
    }

    // /**
    //  * Show individual record
    //  */
    async show({ params, response }: HttpContext) {
        try {
            const location = await Locations.findOrFail(params.id)
            return response.ok({ data: location })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'locations/not-found' })
            }
            return response.internalServerError({ error: 'locations/processing-error' })
        }
    }

    // /**
    //  * Handle form submission for the edit action
    //  */
    async update({ params, request, response }: HttpContext) {
        try {
            let payload = request.all()
            const { authUid, ...filteredPayload } = payload
            const uid: string = payload.authUid

            const validatedPayload = await locationSchema.validate(filteredPayload)

            const location = await Locations.findOrFail(params.id)
            location.merge({
                creator_uid: uid,
                public: validatedPayload.public ?? false,
                name: validatedPayload.name,
                address: validatedPayload.address,
                latitude: validatedPayload.latitude,
                longitude: validatedPayload.longitude,
            })
            await location.save()

            return response.ok({ data: location })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'locations/validation-error' })
            } else if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'locations/not-found' })
            } else {
                return response.internalServerError({ error: 'locations/processing-error' })
            }
        }
    }

    // /**
    //  * Delete record
    //  */
    async destroy({ params, response }: HttpContext) {
        try {
            const location = await Locations.findOrFail(params.id)
            await location.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'locations/not-found' })
            }
            return response.internalServerError({ error: 'locations/processing-error' })
        }
    }
}
