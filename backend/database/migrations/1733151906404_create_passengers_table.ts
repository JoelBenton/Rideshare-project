import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'passengers'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('trip_id')
                .notNullable()
                .references('id')
                .inTable('trips')
                .onDelete('CASCADE')
            table.string('lat').notNullable()
            table.string('lng').notNullable()
            table.string('address').notNullable()
            table
                .string('user_uid')
                .notNullable()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.boolean('pending').notNullable().defaultTo(true)
            table.string('status').notNullable().defaultTo('pending')
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
