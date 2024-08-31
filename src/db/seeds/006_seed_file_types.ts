import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in the file_types table
  await knex('file_types').del();

  // Insert seed entries into the file_types table
  await knex('file_types').insert([
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Invoice',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Hotel Reservation Confirmation',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Transportation Ticket',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Attraction Entry Ticket',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Flight Booking Confirmation',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Travel Insurance Documentation',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Visa',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Passport',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Identification Document',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Car Rental Confirmation',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
    {
      file_type_id: knex.raw('gen_random_uuid()'),
      file_type_name: 'Medical Documentation',
      active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: null,
      updated_by: null,
    },
  ]);
}
