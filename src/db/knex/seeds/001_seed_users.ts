import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Passwords to hash
  const passwords = ['password1', 'password2', 'password3'];

  // Hash all passwords concurrently
  const hashedPasswords = await Promise.all(passwords.map((password) => bcrypt.hash(password, 10)));

  // Inserts seed entries
  await knex('users').insert([
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user1',
      email: 'user1@example.com',
      password: hashedPasswords[0], // In a real application, make sure the password is hashed
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user2',
      email: 'user2@example.com',
      password: hashedPasswords[1],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      user_id: knex.raw('gen_random_uuid()'),
      username: 'user3',
      email: 'user3@example.com',
      password: hashedPasswords[2],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
