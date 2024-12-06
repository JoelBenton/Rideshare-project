import Vine from '@vinejs/vine'

export const tripSchema = Vine.compile(
    Vine.object({
        Registration: Vine.string(),
        vehicle_id: Vine.number().optional(),
        Make: Vine.string(),
        Color: Vine.string(),
        seats_available: Vine.number(),
        date_of_trip: Vine.string().regex(/^\d{2}-\d{2}-\d{2}$/), // DD-MM-YY format
        time_of_trip: Vine.string().regex(/^\d{2}:\d{2}$/), // HH:mm format
        destination_lat: Vine.string(),
        destination_long: Vine.string(),
        destination_address: Vine.string(),
        origin_lat: Vine.string(),
        origin_long: Vine.string(),
        origin_address: Vine.string(),
    })
)
