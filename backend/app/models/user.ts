import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    declare firebase_uid: string // Firebase UID for integrating Firebase Auth

    @column()
    declare username: string | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @column()
    declare role: 'user' | 'admin'

    @hasMany(() => Trip)
    declare trips: HasMany<typeof Trip>
}
