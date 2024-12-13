import Vine from '@vinejs/vine'

export const tripSchema = Vine.compile(
    Vine.object({
        Registration: Vine.string(),
        vehicle_id: Vine.number().optional(),
        Make: Vine.string(),
        Color: Vine.string(),
        seats_available: Vine.number(),
        date_of_trip: Vine.date(),
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
        id: Vine.string(),
        driver_uid: Vine.string(),
        vehicle_id: Vine.number(),
        Make: Vine.string(),
        Color: Vine.string(),
        Registration: Vine.string(),
        seats_available: Vine.number(),
        seats_occupied: Vine.number(),
        date_of_trip: Vine.date(),
        destination_lat: Vine.string(),
        destination_long: Vine.string(),
        destination_address: Vine.string(),
        origin_lat: Vine.string(),
        origin_long: Vine.string(),
        origin_address: Vine.string(),
    })
)
