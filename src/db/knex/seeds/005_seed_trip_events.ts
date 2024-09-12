import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('trip_events').del();

  // Retrieve the trip ID from the trips table
  const trip = await knex('trips').where({ trip_name: 'Trip to Paris' }).first(); // Example condition to find a specific trip

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Inserts seed entries into the trip_events table
  await knex('trip_events').insert([
    {
      trip_event_id: knex.raw('gen_random_uuid()'),
      event_name: 'Eiffel Tower Visit',
      event_type: 'Sightseeing',
      initial_date: new Date('2024-09-03T10:00:00Z'),
      end_date: new Date('2024-09-03T12:00:00Z'),
      location: 'Eiffel Tower, Paris',
      notes: "Don't forget to bring the binoculars.",
      company_name: 'Paris Tours Co.',
      price: 25.0,
      currency: 'EUR',
      purchase_date: new Date('2024-08-15'),
      created_by: trip.user_id,
      updated_by: trip.user_id,
      trip_id: trip.trip_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      trip_event_id: knex.raw('gen_random_uuid()'),
      event_name: 'Louvre Museum Tour',
      event_type: 'Cultural',
      initial_date: new Date('2024-09-05T14:00:00Z'),
      end_date: new Date('2024-09-05T16:00:00Z'),
      location: 'Louvre Museum, Paris',
      notes: 'Get tickets at the entrance.',
      company_name: 'Museums of Paris',
      price: 30.0,
      currency: 'EUR',
      purchase_date: new Date('2024-08-16'),
      created_by: trip.user_id,
      updated_by: trip.user_id,
      trip_id: trip.trip_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
