import Passenger from '#models/passenger'
import type { HttpContext } from '@adonisjs/core/http'
import { markerSchema, markerUpdateSchema, tripOwnerMarkerUpdateSchema } from '#validators/marker'

export default class MarkersController {
    /**
     * Display a list of resource for a trip
     */
    async TripsIndex({ params, response }: HttpContext) {
        try {
            const tripId = params.trip_id

            const markers = await Passenger.query().where('trip_id', tripId)
            return response.ok({ data: markers })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'markers/not-found' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response }: HttpContext) {
        try {
            const { authUid, ...filteredPayload } = request.all()

            const checkIfUserAlreadyHasMarker = await Passenger.query()
                .where('user_uid', authUid)
                .andWhere('trip_id', String(filteredPayload.trip_id))
                .first()

            if (checkIfUserAlreadyHasMarker) {
                return response.badRequest({ error: 'markers/user-already-has-marker' })
            }

            const validatedPayload = await markerSchema.validate({
                trip_id: String(filteredPayload.trip_id),
                lat: String(filteredPayload.latitude),
                lng: String(filteredPayload.longitude),
                user_uid: filteredPayload.user_uid,
                address: String(filteredPayload.address),
                status: 'pending',
                pending: true,
            })

            const marker = await Passenger.create(validatedPayload)
            return response.created({ data: marker })
        } catch (error) {
            console.log(error)
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'markers/validation-error' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }

    /**
     * Show individual record
     */
    async show({ params, response }: HttpContext) {
        try {
            const marker = await Passenger.findOrFail(params.id)
            return response.ok({ data: marker })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'markers/not-found' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request, response }: HttpContext) {
        try {
            const marker = await Passenger.findOrFail(params.id)

            const { authUid, ...filteredPayload } = request.all()
            const validatedPayload = await markerUpdateSchema.validate(filteredPayload)

            // Only update if there is a change
            marker.merge({
                user_uid: authUid,
                trip_id: validatedPayload.trip_id ?? marker.trip_id,
                lat: validatedPayload.latitude ?? marker.lat,
                lng: validatedPayload.longitude ?? marker.lng,
                address: validatedPayload.address ?? marker.address,
                pending: validatedPayload.pending ?? marker.pending,
                status: validatedPayload.status ?? marker.status,
            })
            await marker.save()
            return response.ok({ data: marker })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'markers/validation-error' })
            }
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'markers/not-found' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }

    async tripOwnerUpdate({ params, request, response }: HttpContext) {
        try {
            const marker = await Passenger.query()
                .where('id', params.id)
                .preload('trip', (query) => query.preload('user'))
                .firstOrFail()

            const { authUid, ...filteredPayload } = request.all()
            const validatedPayload = await tripOwnerMarkerUpdateSchema.validate(filteredPayload)

            if (marker.trip.user.firebase_uid !== authUid) {
                return response.forbidden({ error: 'markers/not-allowed' })
            }

            if (
                validatedPayload.status &&
                ['confirmed', 'pending', 'declined'].includes(validatedPayload.status) === false
            ) {
                return response.badRequest({ error: 'markers/trip-status-error' })
            }

            // Only update if there is a change
            marker.merge({
                pending: validatedPayload.pending ?? marker.pending,
                status: validatedPayload.status ?? marker.status,
            })
            await marker.save()
            return response.ok({ data: marker })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'markers/validation-error' })
            }
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'markers/not-found' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }

    /**
     * Delete record
     */
    async destroy({ params, response }: HttpContext) {
        try {
            const marker = await Passenger.findOrFail(params.id)
            await marker.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'markers/not-found' })
            }
            return response.internalServerError({ error: 'markers/processing-error' })
        }
    }
}
