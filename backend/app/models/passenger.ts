import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Trip from './trip.js'
import { DateTime } from 'luxon'

export default class Passenger extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare trip_id: number

    @column()
    declare lat: string

    @column()
    declare lng: string

    @column()
    declare address: string

    @column()
    declare user_uid: string

    @column()
    declare pending: boolean // True if the passenger has been confirmed status by the driver or false if not

    @column()
    declare status: string // 'confirmed' | 'pending' | 'declined'

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => User, { foreignKey: 'user_uid', localKey: 'firebase_uid' })
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Trip, { foreignKey: 'trip_id', localKey: 'id' })
    declare trip: BelongsTo<typeof Trip>
}
