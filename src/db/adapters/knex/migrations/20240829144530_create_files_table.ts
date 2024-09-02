import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', function (table) {
    table.uuid('file_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('file_name', 255).notNullable();
    table
      .uuid('file_type_id')
      .notNullable()
      .references('file_type_id')
      .inTable('file_types')
      .onDelete('RESTRICT');
    table.boolean('is_deleted').defaultTo(false);
    table.string('file_extension', 20);
    table.integer('file_size');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('created_by');
    table.uuid('updated_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('files');
}
