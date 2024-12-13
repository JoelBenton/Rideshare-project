import vine from '@vinejs/vine'

export const vehicleSchema = vine.compile(
    vine.object({
        registration: vine.string(),
        make: vine.string(),
        color: vine.string(),
    })
)

export const vehicleUpdateSchema = vine.compile(
    vine.object({
        id: vine.string(),
        owner_uid: vine.string(),
        registration: vine.string().optional(),
        make: vine.string().optional(),
        color: vine.string().optional(),
    })
)
