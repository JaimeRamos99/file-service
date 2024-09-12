import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trip_events', function (table) {
    table.uuid('trip_event_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('trip_id').notNullable().references('trip_id').inTable('trips').onDelete('CASCADE');
    table.string('event_name', 255).notNullable();
    table.string('event_type', 50);
    table.timestamp('initial_date').notNullable();
    table.timestamp('end_date');
    table.string('timezone', 50);
    table.boolean('active').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.string('location', 255);
    table.string('notes', 1000);
    table.string('company_name', 255);
    table.decimal('price', 10, 2);
    table.string('currency', 3);
    table.timestamp('purchase_date').notNullable();
    table.uuid('created_by');
    table.uuid('updated_by');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('trip_events');
}
