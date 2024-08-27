import { IFileStorageProvider } from './fileStorageProvider';

export default class FileStorageManager {
  private provider: IFileStorageProvider;
  constructor(provider: IFileStorageProvider) {
    this.provider = provider;
  }

  async uploadFile(FilePath: string): Promise<string> {
    return await this.provider.uploadFile(FilePath);
  }

  async getFileLink(fileName: string) {}
}
