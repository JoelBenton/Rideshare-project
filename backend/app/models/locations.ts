import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Locations extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare creator_uid: string

    @column()
    declare public: boolean

    @column()
    declare name: string

    @column()
    declare address: string

    @column()
    declare latitude: number

    @column()
    declare longitude: number

    @belongsTo(() => User)
    declare creator: BelongsTo<typeof User>
}
