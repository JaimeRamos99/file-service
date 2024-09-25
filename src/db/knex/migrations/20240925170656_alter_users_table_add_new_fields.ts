import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.boolean('email_verified').defaultTo(false);
    table.string('role').defaultTo('admin');
    table.string('created_by').defaultTo('seed');
    table.string('updated_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.dropColumn('is_active');
    table.dropColumn('is_deleted');
    table.dropColumn('email_verified');
    table.dropColumn('role');
    table.dropColumn('created_by');
    table.dropColumn('updated_by');
  });
}
