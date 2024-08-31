import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trip_events', function (table) {
    table.uuid('event_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('event_name', 255).notNullable();
    table.string('event_type', 50);
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time');
    table.string('location', 255);
    table.string('notes', 1000);
    table.string('company_name', 255);
    table.decimal('price', 10, 2);
    table.string('currency', 3);
    table.timestamp('purchase_date').notNullable();
    table.uuid('created_by');
    table.uuid('updated_by');
    table.uuid('trip_id').notNullable().references('trip_id').inTable('trips').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('trip_events');
}
