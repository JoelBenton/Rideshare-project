import Trip from '#models/trip'
import Vehicle from '#models/vehicle'
import { tripSchema, tripUpdateSchema } from '#validators/trip'
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
    async store({ request, response }: HttpContext) {
        try {
            const { authUid, ...payload } = request.all()
            const validatedPayload = await tripSchema.validate(payload)

            // Extract Date in DD-MM-YY format
            const formattedDate = validatedPayload.date_of_trip.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            })

            // Extract Time in HH-MM format
            const formattedTime = validatedPayload.date_of_trip.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Use 24-hour format
            })

            let trip = null

            if (validatedPayload.vehicle_id) {
                trip = await Trip.create({
                    driver_uid: authUid,
                    vehicle_id: validatedPayload.vehicle_id,
                    seats_available: validatedPayload.seats_available,
                    seats_occupied: 0,
                    date_of_trip: formattedDate,
                    time_of_trip: formattedTime,
                    destination_lat: validatedPayload.destination_lat,
                    destination_long: validatedPayload.destination_long,
                    destination_address: validatedPayload.destination_address,
                    origin_address: validatedPayload.origin_address,
                    origin_lat: validatedPayload.origin_lat,
                    origin_long: validatedPayload.origin_long,
                })
            } else {
                const vehicle = await Vehicle.create({
                    owner_uid: authUid,
                    registration: validatedPayload.Registration,
                    make: validatedPayload.Make,
                    color: validatedPayload.Color,
                })

                trip = await Trip.create({
                    driver_uid: authUid,
                    vehicle_id: vehicle.id,
                    seats_available: validatedPayload.seats_available,
                    seats_occupied: 0,
                    date_of_trip: formattedDate,
                    time_of_trip: formattedTime,
                    destination_lat: validatedPayload.destination_lat,
                    destination_long: validatedPayload.destination_long,
                    destination_address: validatedPayload.destination_address,
                    origin_address: validatedPayload.origin_address,
                    origin_lat: validatedPayload.origin_lat,
                    origin_long: validatedPayload.origin_long,
                })
            }

            return response.created({ data: trip })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'trips/validation-error' })
            }
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'trips/vehicle-not-found' })
            }
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Show individual record
     */
    async show({ params, response }: HttpContext) {
        try {
            const trip = await Trip.findOrFail(params.id)
            trip.load('user')
            trip.load('vehicle')
            trip.load('markers', (query) => {
                query.preload('user')
            })
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
    async update({ params, request, response }: HttpContext) {
        try {
            const trip = await Trip.findOrFail(params.id)

            const { authUid, ...filteredPayload } = request.all()

            const validatedPayload = await tripUpdateSchema.validate(filteredPayload)

            if (trip.driver_uid !== authUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }

            const formattedDate = validatedPayload.date_of_trip.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            })

            const formattedTime = validatedPayload.date_of_trip.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Use 24-hour format
            })

            const vehicle = await Vehicle.findOrFail(trip.vehicle_id)

            vehicle.merge({
                owner_uid: authUid,
                registration: validatedPayload.Registration ?? vehicle.registration,
                make: validatedPayload.Make ?? vehicle.make,
                color: validatedPayload.Color ?? vehicle.color,
            })
            await vehicle.save()

            trip.date_of_trip = formattedDate
            trip.time_of_trip = formattedTime

            trip.seats_available = validatedPayload.seats_available
            trip.seats_occupied = validatedPayload.seats_occupied

            trip.destination_lat = validatedPayload.destination_lat
            trip.destination_long = validatedPayload.destination_long
            trip.destination_address = validatedPayload.destination_address
            trip.origin_address = validatedPayload.origin_address
            trip.origin_lat = validatedPayload.origin_lat
            trip.origin_long = validatedPayload.origin_long

            await trip.save()
            return response.ok({ data: trip })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'trips/not-found' })
            }
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'trips/validation-error' })
            }
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

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
