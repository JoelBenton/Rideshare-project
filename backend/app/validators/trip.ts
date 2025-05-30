import Vine from '@vinejs/vine'

export const tripSchema = Vine.compile(
    Vine.object({
        trip_name: Vine.string(),
        Registration: Vine.string(),
        vehicle_id: Vine.number().optional(),
        Make: Vine.string(),
        Color: Vine.string(),
        seats_available: Vine.number(),
        date_of_trip: Vine.date({ formats: { utc: true } }),
        destination_lat: Vine.string(),
        destination_long: Vine.string(),
        destination_address: Vine.string(),
        origin_lat: Vine.string(),
        origin_long: Vine.string(),
        origin_address: Vine.string(),
    })
)

export const tripUpdateSchema = Vine.compile(
    Vine.object({
        trip_name: Vine.string().optional(),
        vehicle_id: Vine.number().optional(),
        Make: Vine.string().optional(),
        Color: Vine.string().optional(),
        Registration: Vine.string().optional(),
        seats_available: Vine.number().optional(),
        seats_occupied: Vine.number().optional(),
        date_of_trip: Vine.date({ formats: { utc: true } }).optional(),
        destination_lat: Vine.string().optional(),
        destination_long: Vine.string().optional(),
        destination_address: Vine.string().optional(),
        origin_lat: Vine.string().optional(),
        origin_long: Vine.string().optional(),
        origin_address: Vine.string().optional(),
    })
)
