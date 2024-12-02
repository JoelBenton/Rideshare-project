import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Marker extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare trip_id: string

    @column()
    declare lat: string

    @column()
    declare lng: string

    @column()
    declare address: string

    @column()
    declare user_uid: string

    @belongsTo(() => User, { foreignKey: 'user_uid' })
    declare user: BelongsTo<typeof User>
}
