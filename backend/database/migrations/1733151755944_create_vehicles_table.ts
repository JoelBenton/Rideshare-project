import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'vehicles'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .string('owner_uid')
                .notNullable()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.string('registration').notNullable()
            table.string('make').notNullable()
            table.string('color').notNullable()
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
