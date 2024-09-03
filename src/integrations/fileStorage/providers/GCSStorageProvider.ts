import { IFileStorageProvider, IStorageConfig } from '../';
import { env } from '../../../utils/secretManager';
import { Storage } from '@google-cloud/storage';

const storageInstance = new Storage({
  projectId: env.FILES_MANAGER_CLIENT_SERVICE_KEY.project_id,
  credentials: env.FILES_MANAGER_CLIENT_SERVICE_KEY,
});

export default class GCSStorageProvider implements IFileStorageProvider {
  private config: IStorageConfig;

  constructor() {
    this.config = env.GCSCONFIG;
  }

  async uploadFile(filePath: string): Promise<void> {
    await storageInstance.bucket(this.config.bucketName).upload(filePath, this.config.options);
  }

  async getSignedURL(fileName: string): Promise<string> {
    const [url] = await storageInstance
      .bucket(this.config.bucketName)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + env.CACHE_TTL_MS_SIGNED_URL,
      });
    return url;
  }
  async deleteFile(): Promise<void> {}
}
