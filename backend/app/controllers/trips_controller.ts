import Trip from '#models/trip'
import type { HttpContext } from '@adonisjs/core/http'

export default class TripsController {
    /**
     * Display a list of resource
     */
    async index({ response }: HttpContext) {
        try {
            const trips = await Trip.query()
                .preload('user')
                .preload('vehicle')
                .preload('markers', (query) => {
                    query.preload('user')
                })
            return response.ok({ data: trips })
        } catch (error) {
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response }: HttpContext) {}

    /**
     * Show individual record
     */
    async show({ params, response }: HttpContext) {
        try {
            const trip = await Trip.findOrFail(params.id)
            return response.ok({ data: trip })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'trips/not-found' })
            }
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request }: HttpContext) {}

    /**
     * Delete record
     */
    async destroy({ params, request, response }: HttpContext) {
        try {
            const trip = await Trip.findOrFail(params.id)
            if (trip.driver_uid !== request.all().authUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }
            await trip.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'trips/not-found' })
            }
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }
}
