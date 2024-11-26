import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable()
            table.string('username').nullable().unique()
            table.string('firebase_uid').notNullable().unique()
            table.enum('role', ['user', 'admin']).notNullable().defaultTo('user')
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
