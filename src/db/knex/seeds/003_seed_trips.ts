import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('trips').del();

  const user1 = await knex('users').where({ username: 'user1' }).first();

  if (!user1) {
    throw new Error('User not found');
  }

  // Inserts seed entries
  await knex('trips').insert([
    {
      trip_id: knex.raw('gen_random_uuid()'),
      trip_name: 'Trip to Paris',
      initial_date: new Date('2024-09-01'),
      end_date: new Date('2024-09-15'),
      user_id: user1.user_id, // Replace with actual user UUIDs from your users table
      created_by: user1.user_id,
      updated_by: user1.user_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      trip_id: knex.raw('gen_random_uuid()'),
      trip_name: 'Business Trip to New York',
      initial_date: new Date('2024-10-05'),
      end_date: new Date('2024-10-10'),
      user_id: user1.user_id,
      created_by: user1.user_id,
      updated_by: user1.user_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      trip_id: knex.raw('gen_random_uuid()'),
      trip_name: 'Vacation in Japan',
      initial_date: new Date('2024-11-20'),
      end_date: new Date('2024-12-05'),
      user_id: user1.user_id,
      created_by: user1.user_id,
      updated_by: user1.user_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
