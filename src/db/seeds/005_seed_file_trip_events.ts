import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('FilesTripsEvents').del();

  const file1 = await knex('files')
    .where({
      file_name: 'document.pdf',
    })
    .first();
  const trip1 = await knex('trips')
    .where({
      trip_name: 'Trip to Paris',
    })
    .first();
  const tripEvent1 = await knex('trip_events')
    .where({
      event_name: 'Louvre Museum Tour',
    })
    .first();

  if (!file1) {
    throw new Error('Required related records not found');
  }

  await knex('FilesTripsEvents').insert([
    {
      id: knex.raw('gen_random_uuid()'),
      file_id: file1.file_id,
      trip_id: trip1.trip_id,
      trip_event_id: null,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: trip1.user_id,
      updated_by: trip1.user_id,
    },
    {
      id: knex.raw('gen_random_uuid()'),
      file_id: file1.file_id,
      trip_id: null,
      trip_event_id: tripEvent1.event_id,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      created_by: trip1.user_id,
      updated_by: trip1.user_id,
    },
  ]);
}