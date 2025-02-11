import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Whitelist extends BaseModel {
    @column({ isPrimary: true })
    declare email: string
}
