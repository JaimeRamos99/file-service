import { getKnexInstance } from '../db/knex';
import { IFileTripEvent } from '../entities';

export interface IFileTripEventRepository {
  create(fileTripEventData: IFileTripEvent): Promise<void>;
}
export class FileTripEventRepository implements IFileTripEventRepository {
  private tableName = 'files_trips_events_map';
  private knex = getKnexInstance();

  async create(fileTripEventData: IFileTripEvent): Promise<void> {
    await this.knex<IFileTripEvent>(this.tableName).insert(fileTripEventData);
  }
}
