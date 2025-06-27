import { getKnexInstance } from '../db/knex';
import { ITrip, CreateTripInput, UpdateTripInput } from '../entities';

export interface ITripRepository {
  create(tripData: CreateTripInput): Promise<ITrip>;
  findById(tripId: string): Promise<ITrip | undefined>;
  findByUserId(userId: string, offset: number, limit: number): Promise<ITrip[]>;
  update(tripId: string, tripData: UpdateTripInput, userId: string): Promise<ITrip | undefined>;
  softDelete(tripId: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
}

export class TripRepository implements ITripRepository {
  private tableName = 'trips';
  private knex = getKnexInstance();

  async create(tripData: CreateTripInput): Promise<ITrip> {
    const [result] = await this.knex<ITrip, ITrip>(this.tableName)
      .insert({
        ...tripData,
        created_by: tripData.user_id,
        updated_by: tripData.user_id,
      })
      .returning('*');
    return result;
  }

  async findById(tripId: string): Promise<ITrip | undefined> {
    return this.knex<ITrip>(this.tableName).where({ id: tripId, is_deleted: false }).first();
  }

  async findByUserId(userId: string, offset: number, limit: number): Promise<ITrip[]> {
    return this.knex<ITrip>(this.tableName)
      .where({ user_id: userId, is_deleted: false })
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);
  }

  async update(tripId: string, tripData: UpdateTripInput, userId: string): Promise<ITrip | undefined> {
    const [result] = await this.knex<ITrip, ITrip>(this.tableName)
      .where({ id: tripId, user_id: userId, is_deleted: false })
      .update({
        ...tripData,
        updated_at: this.knex.fn.now(),
        updated_by: userId,
      })
      .returning('*');
    return result;
  }

  async softDelete(tripId: string): Promise<void> {
    await this.knex<ITrip>(this.tableName)
      .where({ id: tripId, is_deleted: false })
      .update({ is_deleted: true, updated_at: this.knex.fn.now() });
  }

  async countByUserId(userId: string): Promise<number> {
    const [result] = await this.knex<ITrip>(this.tableName)
      .where({ user_id: userId, is_deleted: false })
      .count();
    return Number(result?.count);
  }
}
