import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Vehicle extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare owner_uid: string

    @column()
    declare registration: string

    @column()
    declare make: string

    @column()
    declare color: string

    @belongsTo(() => User, { foreignKey: 'owner_uid' })
    declare owner: BelongsTo<typeof User>
}
