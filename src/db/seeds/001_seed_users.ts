import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user1',
      email: 'user1@example.com',
      password: 'hashedpassword1', // In a real application, make sure the password is hashed
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user2',
      email: 'user2@example.com',
      password: 'hashedpassword2',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user3',
      email: 'user3@example.com',
      password: 'hashedpassword3',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
