import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
