import { getKnexInstance } from '../db/knex';
import { IFile } from '../entities';

export interface IFileRepository {
  getFileByUniqueName(fileUniqueName: string): Promise<IFile | undefined>;
  saveFile(file: IFile): Promise<IFile>;
  countFilesByHashAndTrip(fileHash: string, tripId: string, tripEventId: string): Promise<number>;
}

export class FileRepository implements IFileRepository {
  private tableName = 'files';
  private knex = getKnexInstance();

  getFileById(fileId: string) {
    return this.knex<IFile>(this.tableName).where({ file_id: fileId }).first();
  }

  getFileByUniqueName(fileUniqueName: string): Promise<IFile | undefined> {
    return this.knex<IFile>(this.tableName).where({ file_unique_name: fileUniqueName }).first();
  }

  async saveFile(file: IFile): Promise<IFile> {
    const [result] = await this.knex<IFile, IFile>(this.tableName).insert(file).returning('*');
    return result;
  }

  async countFilesByHashAndTrip(fileHash: string, tripId?: string, tripEventId?: string): Promise<number> {
    const andCondition = tripId
      ? { 'files_trips_events_map.trip_id': tripId }
      : {
          'files_trips_events_map.trip_event_id': tripEventId,
        };
    const [response] = await this.knex<IFile>(this.tableName)
      .innerJoin('files_trips_events_map', 'files.file_id', 'files_trips_events_map.file_id')
      .where({ 'files.file_hash': fileHash })
      .andWhere(andCondition)
      .count();
    return Number(response?.count);
  }

  softDeleteFile(fileId: string) {
    return this.knex<IFile>(this.tableName).where({ file_id: fileId }).update({ is_deleted: true });
  }
}
