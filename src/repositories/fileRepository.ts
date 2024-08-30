import { getKnexInstance } from '../db/connection';
import { IFile } from '../entities';

export interface IFileRepository {
  getFileByName(fileName: string): Promise<IFile | undefined>;
  saveFile(file: IFile): Promise<IFile>;
}

const knexInstance = getKnexInstance();
export class FileRepository implements IFileRepository {
  private tableName = 'files';

  getFileByName(fileName: string): Promise<IFile | undefined> {
    return knexInstance<IFile, IFile>(this.tableName).where({ file_name: fileName }).first();
  }

  async saveFile(file: IFile): Promise<IFile> {
    const [result] = await knexInstance<IFile, IFile>(this.tableName).insert(file).returning('*');
    return result;
  }
}
