import { getKnexInstance } from '../db/connection';
import { IFileTripEvent } from '../entities';

export interface IFileTripEventRepository {
  create(fileTripEventData: IFileTripEvent): Promise<void>;
}

const knexInstance = getKnexInstance();
export class FileTripEventRepository implements IFileTripEventRepository {
  private tableName = 'files_trips_events_map';

  async create(fileTripEventData: IFileTripEvent) {
    await knexInstance<IFileTripEvent, IFileTripEvent>(this.tableName).insert(fileTripEventData);
  }
}
