import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'trips'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('trip_name').notNullable()
            table
                .integer('driver_uid')
                .unsigned()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.integer('vehicle_id').unsigned().references('id').inTable('vehicles')
            table.integer('seats_occupied').notNullable().defaultTo(0)
            table.integer('seats_available').notNullable().defaultTo(0)
            table.string('date_of_trip').notNullable()
            table.string('time_of_trip').notNullable()
            table.string('destination_lat').notNullable()
            table.string('destination_long').notNullable()
            table.string('destination_address').notNullable()
            table.string('origin_lat').notNullable()
            table.string('origin_long').notNullable()
            table.string('origin_address').notNullable()
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
