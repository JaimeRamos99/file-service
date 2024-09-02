import { IDatabaseAdapter } from '../db/adapters';
import { IFileTripEvent } from '../entities';

export interface IFileTripEventRepository {
  create(fileTripEventData: IFileTripEvent): Promise<void>;
}
export class FileTripEventRepository implements IFileTripEventRepository {
  private tableName = 'files_trips_events_map';
  constructor(private dbAdapter: IDatabaseAdapter<IFileTripEvent>) {}

  async create(fileTripEventData: IFileTripEvent): Promise<void> {
    await this.dbAdapter.insert(this.tableName, fileTripEventData);
  }
}
