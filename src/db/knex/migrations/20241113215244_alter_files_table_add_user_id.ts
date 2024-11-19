import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('files', function (table) {
    table.uuid('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('files', function (table) {
    table.dropColumn('user_id');
  });
}
