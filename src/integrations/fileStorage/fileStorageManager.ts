import { IFileStorageProvider } from './fileStorageProvider';

export default class FileStorageManager {
  private provider: IFileStorageProvider;
  constructor(provider: IFileStorageProvider) {
    this.provider = provider;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<void> {
    await this.provider.uploadFile(fileBuffer, fileName);
  }

  async getSignedURL(fileName: string) {
    return await this.provider.getSignedURL(fileName);
  }
}
