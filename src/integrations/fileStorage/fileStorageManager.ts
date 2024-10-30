import { IFileStorageProvider } from './fileStorageProvider';

export default class FileStorageManager {
  private provider: IFileStorageProvider;
  constructor(provider: IFileStorageProvider) {
    this.provider = provider;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<void> {
    await this.provider.uploadFile(fileBuffer, fileName);
  }

  async getSignedUrl(fileName: string) {
    return await this.provider.getSignedUrl(fileName);
  }
}
