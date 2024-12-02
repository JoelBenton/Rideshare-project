import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'vehicles'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('trip_id')
                .notNullable()
                .references('id')
                .inTable('trips')
                .onDelete('CASCADE')
            table
                .string('owner_uid')
                .notNullable()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.string('registration').notNullable()
            table.string('brand').notNullable()
            table.string('color').notNullable()
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
