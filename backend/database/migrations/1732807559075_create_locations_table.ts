import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'locations'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .string('creator_uid')
                .notNullable()
                .unique()
                .unsigned()
                .references('firebase_uid')
                .inTable('users')
                .onDelete('CASCADE')
            table.boolean('public').notNullable().defaultTo(false)
            table.string('name').notNullable()
            table.string('address').notNullable()
            table.double('latitude').notNullable()
            table.double('longitude').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
