import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare username: string | null

    @column()
    declare firebaseUid: string // Firebase UID for integrating Firebase Auth

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @column()
    declare role: 'user' | 'admin'
}
