import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('screen_id').unsigned().references('id').inTable('screens').onDelete('CASCADE')
      table
        .integer('content_id')
        .unsigned()
        .references('id')
        .inTable('contents')
        .onDelete('CASCADE')
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.boolean('monday').defaultTo(false)
      table.boolean('tuesday').defaultTo(false)
      table.boolean('wednesday').defaultTo(false)
      table.boolean('thursday').defaultTo(false)
      table.boolean('friday').defaultTo(false)
      table.boolean('saturday').defaultTo(false)
      table.boolean('sunday').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
