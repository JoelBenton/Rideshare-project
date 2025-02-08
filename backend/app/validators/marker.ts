import Vine from '@vinejs/vine'

export const markerSchema = Vine.compile(
    Vine.object({
        trip_id: Vine.number(),
        lat: Vine.string(),
        lng: Vine.string(),
        address: Vine.string(),
        user_uid: Vine.string(),
        pending: Vine.boolean().optional(),
        status: Vine.string().optional(),
    })
)

export const markerUpdateSchema = Vine.compile(
    Vine.object({
        id: Vine.string(),
        trip_id: Vine.number().optional(),
        latitude: Vine.string().optional(),
        longitude: Vine.string().optional(),
        address: Vine.string().optional(),
        user_uid: Vine.string().optional(),
        pending: Vine.boolean().optional(),
        status: Vine.string().optional(),
    })
)

export const tripOwnerMarkerUpdateSchema = Vine.compile(
    Vine.object({
        pending: Vine.boolean().optional(),
        status: Vine.string().optional(),
    })
)
