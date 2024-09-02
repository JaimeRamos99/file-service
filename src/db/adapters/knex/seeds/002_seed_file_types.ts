import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('files').del();
  await knex('file_types').del();

  // Insert seed entries into the file_types table
  await knex('file_types').insert([
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Invoice',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Hotel Reservation Confirmation',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Transportation Ticket',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Attraction Entry Ticket',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Flight Booking Confirmation',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Travel Insurance Documentation',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Visa',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Passport',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Identification Document',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Car Rental Confirmation',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Medical Documentation',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
  ]);
}
