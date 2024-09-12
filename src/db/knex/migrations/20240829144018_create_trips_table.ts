import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('trips', function (table) {
    table.uuid('trip_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('trip_name', 255).notNullable();
    table.timestamp('initial_date').notNullable();
    table.timestamp('end_date');
    table.boolean('active').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.uuid('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.uuid('created_by').notNullable();
    table.uuid('updated_by');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('trips');
}
