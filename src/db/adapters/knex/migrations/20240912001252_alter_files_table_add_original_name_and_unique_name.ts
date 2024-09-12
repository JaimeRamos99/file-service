import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('files', (table) => {
    table.renameColumn('file_name', 'file_original_name');
    table.string('file_unique_name').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('files', (table) => {
    table.renameColumn('file_original_name', 'file_name');
    table.dropColumn('file_unique_name');
  });
}
