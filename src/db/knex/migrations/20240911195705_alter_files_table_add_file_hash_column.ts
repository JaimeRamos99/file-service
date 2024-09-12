import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('files', function (table) {
    table.string('file_hash').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('files', function (table) {
    table.dropColumn('file_hash');
  });
}
