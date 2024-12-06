import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'trips'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('driver_uid')
                .unsigned()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.integer('vehicle_id').unsigned().references('id').inTable('vehicles')
            table.integer('seats_occupied').notNullable().defaultTo(0)
            table.integer('seats_available').notNullable().defaultTo(0)
            table.dateTime('date_of_trip').notNullable()
            table.dateTime('time_of_trip').notNullable()
            table.integer('destination_id').notNullable().references('id').inTable('markers')
            table.integer('origin_id').notNullable().references('id').inTable('markers')
            table.timestamps(true, true)
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
