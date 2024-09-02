import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('file_types', (table) => {
    table.uuid('file_type_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('file_type_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.uuid('updated_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('file_types');
}
