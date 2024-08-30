import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('FilesTripsEvents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('file_id').notNullable().references('file_id').inTable('files').onDelete('CASCADE');
    table.uuid('trip_id').nullable().references('trip_id').inTable('trips').onDelete('CASCADE');
    table.uuid('trip_event_id').nullable().references('event_id').inTable('trip_events').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.uuid('updated_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('FilesTripsEvents');
}
