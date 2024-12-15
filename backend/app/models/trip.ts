import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Vehicle from './vehicle.js'
import Passenger from './passenger.js'

export default class Trip extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare trip_name: string

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

    @belongsTo(() => User, { foreignKey: 'driver_uid', localKey: 'firebase_uid' })
    declare user: BelongsTo<typeof User>

    @hasOne(() => Vehicle, { foreignKey: 'id', localKey: 'vehicle_id' })
    declare vehicle: HasOne<typeof Vehicle>

    @hasMany(() => Passenger, { foreignKey: 'trip_id', localKey: 'id' })
    declare passengers: HasMany<typeof Passenger>
}
