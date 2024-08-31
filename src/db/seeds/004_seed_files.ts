import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in the files table
  await knex('files').del();

  const user1 = await knex('users').where({ username: 'user1' }).first();

  if (!user1) {
    throw new Error('User not found');
  }

  const fileType1 = await knex('file_types').where({ file_type_name: 'Invoice' }).first();

  if (!fileType1) {
    throw new Error('File type not found');
  }

  // Inserts seed entries into the files table
  await knex('files').insert([
    {
      file_id: knex.raw('gen_random_uuid()'),
      file_name: 'document.pdf',
      file_type_id: fileType1.file_type_id,
      file_extension: 'pdf',
      file_size: 2048000, // size in bytes
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: user1.user_id, // Replace with actual user UUIDs
      updated_by: user1.user_id, // Replace with actual user UUIDs
    },
    {
      file_id: knex.raw('gen_random_uuid()'),
      file_name: 'image.jpg',
      file_type_id: fileType1.file_type_id,
      file_extension: 'jpg',
      file_size: 1024000,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: user1.user_id,
      updated_by: user1.user_id,
    },
    {
      file_id: knex.raw('gen_random_uuid()'),
      file_name: 'spreadsheet.xls',
      file_type_id: fileType1.file_type_id,
      file_extension: 'xls',
      file_size: 512000,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: user1.user_id,
      updated_by: user1.user_id,
    },
    // Add more entries as needed
  ]);
}
