import { IDatabaseAdapter } from '../db/adapters';
import { IFile } from '../entities';

export interface IFileRepository {
  getFileByName(fileName: string): Promise<IFile | undefined>;
  saveFile(file: IFile): Promise<IFile>;
}

export class FileRepository implements IFileRepository {
  private tableName = 'files';

  constructor(private dbAdapter: IDatabaseAdapter<IFile>) {}
  getFileByName(fileName: string): Promise<IFile | undefined> {
    return this.dbAdapter.findOne(this.tableName, { file_name: fileName });
  }

  async saveFile(file: IFile): Promise<IFile> {
    return this.dbAdapter.insert(this.tableName, file);
  }
}
