import Vehicle from '#models/vehicle'
import { vehicleSchema, vehicleUpdateSchema } from '#validators/vehicle'
import type { HttpContext } from '@adonisjs/core/http'

export default class VehiclesController {
    /**
     * Display a list of resource for the authenticated user
     * There will never be a need for global vehicles list. Only user specific vehicles.
     */
    async index({ request, response }: HttpContext) {
        try {
            const uid = request.all().authUid
            const vehicles = await Vehicle.query().where('owner_uid', uid)

            return response.ok({ data: vehicles })
        } catch (error) {
            console.error(error)
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'vehicles/not-found' })
            }
            return response.internalServerError({ error: 'vehicles/processing-error' })
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

            const validatedPayload = await vehicleSchema.validate(filteredPayload)

            const vehicle = await Vehicle.create({
                owner_uid: uid,
                registration: validatedPayload.registration,
                make: validatedPayload.make,
                color: validatedPayload.color,
            })

            return response.created({ data: vehicle })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'vehicles/validation-error' })
            }
            return response.internalServerError({ error: 'vehicles/processing-error' })
        }
    }

    /**
     * Show individual record
     */
    async show({ params, request, response }: HttpContext) {
        try {
            const vehicle = await Vehicle.findOrFail(params.id)
            if (vehicle.owner_uid !== request.all().authUid) {
                return response.forbidden({ error: 'vehicles/forbidden' })
            }
            return response.ok({ data: vehicle })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'vehicles/not-found' })
            }
            return response.internalServerError({ error: 'vehicles/processing-error' })
        }
    }

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request, response }: HttpContext) {
        try {
            let payload = request.all()
            const { authUid, ...filteredPayload } = payload
            const uid: string = payload.authUid

            const validatedPayload = await vehicleUpdateSchema.validate(filteredPayload)

            const vehicle = await Vehicle.findOrFail(params.id)

            // Only allow user to update their own vehicle
            if (vehicle.owner_uid !== uid) {
                return response.forbidden({ error: 'vehicles/forbidden' })
            }

            // Only update if there is a change
            vehicle.merge({
                owner_uid: uid,
                registration: validatedPayload.registration ?? vehicle.registration,
                make: validatedPayload.make ?? vehicle.make,
                color: validatedPayload.color ?? vehicle.color,
            })
            await vehicle.save()

            return response.ok({ data: vehicle })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ error: 'vehicles/validation-error' })
            }
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'vehicles/not-found' })
            }
            return response.internalServerError({ error: 'vehicles/processing-error' })
        }
    }

    /**
     * Delete record
     */
    async destroy({ params, request, response }: HttpContext) {
        try {
            const vehicle = await Vehicle.findOrFail(params.id)
            if (vehicle.owner_uid !== request.all().authUid) {
                return response.forbidden({ error: 'vehicles/forbidden' })
            }
            await vehicle.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({ error: 'vehicles/not-found' })
            }
            return response.internalServerError({ error: 'vehicles/processing-error' })
        }
    }
}
