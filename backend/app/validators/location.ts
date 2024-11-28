import vine from '@vinejs/vine'

export const locationSchema = vine.compile(
    vine.object({
        public: vine.boolean().optional(),
        name: vine.string(),
        address: vine.string(),
        latitude: vine.number(),
        longitude: vine.number(),
    })
)
