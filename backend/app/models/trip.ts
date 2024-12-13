import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Vehicle from './vehicle.js'
import Marker from './marker.js'

export default class Trip extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare driver_uid: string

    @column()
    declare vehicle_id: number

    @column()
    declare seats_occupied: number

    @column()
    declare seats_available: number

    @column()
    declare date_of_trip: string

    @column()
    declare time_of_trip: string

    @column()
    declare destination_lat: string

    @column()
    declare destination_long: string

    @column()
    declare destination_address: string

    @column()
    declare origin_address: string

    @column()
    declare origin_lat: string

    @column()
    declare origin_long: string

    @belongsTo(() => User, { foreignKey: 'driver_uid' })
    declare user: BelongsTo<typeof User>

    @hasOne(() => Vehicle, { foreignKey: 'vehicle_id' })
    declare vehicle: HasOne<typeof Vehicle>

    @hasMany(() => Marker)
    declare markers: HasMany<typeof Marker>
}
