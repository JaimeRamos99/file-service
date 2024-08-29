import Knex from 'knex';
import { IFile } from '../entities/file';

export interface IFileRepository {
  getFileByName(fileName: string): Promise<IFile | undefined>;
}

export class FileRepository implements IFileRepository {
  private tableName = 'files';

  getFileByName(fileName: string): Promise<IFile | undefined> {
    const file = Knex<IFile, IFile>(this.tableName).where({ file_name: fileName }).first();
    return file;
  }
}
