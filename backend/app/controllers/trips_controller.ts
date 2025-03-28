import Trip from '#models/trip'
import Vehicle from '#models/vehicle'
import { tripSchema, tripUpdateSchema } from '#validators/trip'
import type { HttpContext } from '@adonisjs/core/http'
import { deleteGroup, getGroupIdByTripId, startGroup, updateGroup } from '../helper/group_helper.js'

const formatTrip = (trip: Trip) => {
    return {
        id: trip.id,
        trip_name: trip.trip_name,
        date_of_trip: trip.date_of_trip,
        time_of_trip: trip.time_of_trip,
        driver: {
            id: trip.user.firebase_uid,
            username: trip.user.username,
        },
        vehicle: {
            id: trip.vehicle.id,
            seats_available: trip.seats_available,
            seats_occupied: trip.seats_occupied,
            registration: trip.vehicle.registration,
            make: trip.vehicle.make,
            color: trip.vehicle.color,
        },
        passengers: trip.passengers.map((passenger) => {
            return {
                id: passenger.id,
                lat: passenger.lat,
                lng: passenger.lng,
                address: passenger.address,
                driver: {
                    id: passenger.user.firebase_uid,
                    username: passenger.user.username,
                },
                pending: passenger.pending,
                status: passenger.status,
                meta: {
                    createdAt: passenger.createdAt,
                    updatedAt: passenger.updatedAt,
                },
            }
        }),
        destination: {
            lat: trip.destination_lat,
            lng: trip.destination_long,
            address: trip.destination_address,
        },
        origin: {
            lat: trip.origin_lat,
            lng: trip.origin_long,
            address: trip.origin_address,
        },
    }
}

export default class TripsController {
    /**
     * Display a list of resource
     */
    async index({ response }: HttpContext) {
        try {
            console.log('List Trips Called')
            const tripsLength = await Trip.all()

            if (tripsLength.length === 0) {
                return response.ok({ data: [] })
            }

            const trips = await Trip.query()
                .preload('user')
                .preload('vehicle')
                .preload('passengers', (query) => {
                    query.preload('user')
                })

            // Filter trips that are in the future or current date
            const formattedTrips = trips
                .filter((trip) => {
                    const [day, month, year] = trip.date_of_trip.split('-').map(Number)
                    const tripDate = new Date(year + 2000, month - 1, day)

                    return tripDate >= new Date()
                })
                .map((trip) => {
                    return formatTrip(trip)
                })

            return response.ok({ data: formattedTrips })
        } catch (error) {
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Display a list of resource for the authenticated user where date of trip is in the future or current date
     */
    async userIndex({ request, response, params }: HttpContext) {
        try {
            const uid = request.all().authUid
            const userUid = params.user_id

            if (uid !== userUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }

            const allTrips = await Trip.query()
                .preload('user')
                .preload('vehicle')
                .preload('passengers', (query) => {
                    query.preload('user')
                })

            if (allTrips.length === 0) {
                return response.ok({ data: [] })
            }

            // Filter trips that are in the future or current date
            const formattedTrips = allTrips
                .filter((trip) => {
                    const [day, month, year] = trip.date_of_trip.split('-').map(Number)
                    const [hour, minute] = trip.time_of_trip.split(':').map(Number)
                    const tripDate = new Date(year + 2000, month - 1, day, hour, minute)

                    return tripDate >= new Date()
                })
                .map((trip) => {
                    return formatTrip(trip)
                })

            // Filter trips so only trips where the user is a passenger or driver are returned. Regardless of status
            const filteredTrips = formattedTrips.filter((trip) => {
                return (
                    trip.driver.id === uid ||
                    trip.passengers.some((passenger) => passenger.driver.id === uid)
                )
            })

            return response.ok({ data: filteredTrips })
        } catch (error) {
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Get all trips regardless of
     */
    async all({ response }: HttpContext) {
        try {
            const tripsLength = await Trip.all()
            if (tripsLength.length === 0) {
                return response.ok({ data: [] })
            }

            const trips = await Trip.query()
                .preload('user')
                .preload('vehicle')
                .preload('passengers', (query) => {
                    query.preload('user')
                })

            // Filter trips that are in the future or current date
            const formattedTrips = trips.map((trip) => {
                return formatTrip(trip)
            })

            return response.ok({ data: formattedTrips })
        } catch (error) {
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }

    /**
     * Display a list of resource for the authenticated user
     */
    async userTripsAll({ request, response, params }: HttpContext) {
        try {
            const authUid = request.all().authUid
            const userUid = params.user_id

            if (authUid !== userUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }

            // Check if user has trips before loading all related data
            const allTrips = await Trip.query()
                .preload('user')
                .preload('vehicle')
                .preload('passengers', (query) => {
                    query.preload('user')
                })

            const filteredTrips = allTrips
                .map((trip) => {
                    return formatTrip(trip)
                })
                .filter((trip) => {
                    return (
                        trip.driver.id === userUid ||
                        trip.passengers.some((passenger) => passenger.driver.id === userUid)
                    )
                })
            if (filteredTrips.length === 0) {
                return response.ok({ data: [] })
            }

            return response.ok({ data: filteredTrips })
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

            // Extract Date in DD/MM/YY format
            const formattedDate = validatedPayload.date_of_trip
                .toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                })
                .replace(/\//g, '-')

            // Extract Time in HH-MM format
            const formattedTime = validatedPayload.date_of_trip.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })

            if (validatedPayload.vehicle_id) {
                const createdTrip = await Trip.create({
                    trip_name: validatedPayload.trip_name,
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

                await startGroup(
                    authUid,
                    [],
                    createdTrip.trip_name,
                    createdTrip.id,
                    createdTrip.date_of_trip
                )
            } else {
                const vehicle = await Vehicle.create({
                    owner_uid: authUid,
                    registration: validatedPayload.Registration,
                    make: validatedPayload.Make,
                    color: validatedPayload.Color,
                })

                const createdTrip = await Trip.create({
                    trip_name: validatedPayload.trip_name,
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

                await startGroup(
                    authUid,
                    [],
                    createdTrip.trip_name,
                    createdTrip.id,
                    createdTrip.date_of_trip
                )
            }
            return response.created({ msg: 'Trip created successfully' })
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
            const trip = await Trip.query()
                .where('id', params.id)
                .preload('user')
                .preload('vehicle')
                .preload('passengers', (query) => {
                    query.preload('user')
                })
                .firstOrFail()

            const formattedTrip = formatTrip(trip)
            return response.ok({ data: formattedTrip })
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
            const group = await getGroupIdByTripId(trip.id)

            const { authUid, ...filteredPayload } = request.all()

            const validatedPayload = await tripUpdateSchema.validate(filteredPayload)

            if (trip.driver_uid !== authUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }

            if (validatedPayload.date_of_trip) {
                const formattedDate = validatedPayload.date_of_trip
                    .toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    })
                    .replace(/\//g, '-')

                const formattedTime = validatedPayload.date_of_trip.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })

                trip.date_of_trip = formattedDate
                trip.time_of_trip = formattedTime
            }

            const vehicle = await Vehicle.findOrFail(trip.vehicle_id)

            vehicle.merge({
                owner_uid: authUid,
                registration: validatedPayload.Registration ?? vehicle.registration,
                make: validatedPayload.Make ?? vehicle.make,
                color: validatedPayload.Color ?? vehicle.color,
            })
            await vehicle.save()

            trip.trip_name = validatedPayload.trip_name || trip.trip_name

            trip.seats_available = validatedPayload.seats_available || trip.seats_available
            trip.seats_occupied = validatedPayload.seats_occupied || trip.seats_occupied

            trip.destination_lat = validatedPayload.destination_lat || trip.destination_lat
            trip.destination_long = validatedPayload.destination_long || trip.destination_long
            trip.destination_address =
                validatedPayload.destination_address || trip.destination_address
            trip.origin_address = validatedPayload.origin_address || trip.origin_address
            trip.origin_lat = validatedPayload.origin_lat || trip.origin_lat
            trip.origin_long = validatedPayload.origin_long || trip.origin_long

            await trip.save()

            if (group.group) {
                await updateGroup(group.group, trip.trip_name)
            }

            return response.ok({ msg: 'Trip updated successfully' })
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
            const group = await getGroupIdByTripId(trip.id)
            if (trip.driver_uid !== request.all().authUid) {
                return response.forbidden({ error: 'trips/forbidden' })
            }
            await trip.delete()

            if (group.group) {
                await deleteGroup(group.group)
            }

            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'trips/not-found' })
            }
            return response.internalServerError({ error: 'trips/processing-error' })
        }
    }
}
