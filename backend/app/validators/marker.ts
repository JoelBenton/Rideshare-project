import Vine from '@vinejs/vine'

export const markerSchema = Vine.compile(
    Vine.object({
        trip_id: Vine.string(),
        latitude: Vine.string(),
        longitude: Vine.string(),
        address: Vine.string(),
        user_uid: Vine.string(),
    })
)

export const markerUpdateSchema = Vine.compile(
    Vine.object({
        id: Vine.string(),
        trip_id: Vine.string().optional(),
        latitude: Vine.string().optional(),
        longitude: Vine.string().optional(),
        address: Vine.string().optional(),
        user_uid: Vine.string().optional(),
    })
)
