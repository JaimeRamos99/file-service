import { getKnexInstance } from '../db/knex';
import { IFile } from '../entities';

export interface IFileRepository {
  getFileByUniqueName(fileUniqueName: string): Promise<IFile | undefined>;
  saveFile(file: IFile): Promise<IFile>;
}

export class FileRepository implements IFileRepository {
  private tableName = 'files';
  private knex = getKnexInstance();

  async getFileByUniqueName(fileUniqueName: string): Promise<IFile | undefined> {
    return this.knex<IFile>(this.tableName).where({ file_unique_name: fileUniqueName }).first();
  }

  async saveFile(file: IFile): Promise<IFile> {
    const [result] = await this.knex<IFile, IFile>(this.tableName).insert(file).returning('*');
    return result;
  }

  async checkFileExistence() {}
}
