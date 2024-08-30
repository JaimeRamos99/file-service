import { getKnexInstance } from '../db/connection';
import { IFileTripEvent } from '../entities';

export interface IFileTripEventRepository {
  create(fileTripEventData: IFileTripEvent): Promise<void>;
}

const knexInstance = getKnexInstance();
export class FileTripEventRepository implements IFileTripEventRepository {
  private tableName = 'FilesTripsEvents';

  async create(fileTripEventData: IFileTripEvent) {
    await knexInstance<IFileTripEvent, IFileTripEvent>(this.tableName).insert(fileTripEventData);
  }
}
