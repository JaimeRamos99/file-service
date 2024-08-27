import { IFileStorageProvider, IStorageConfig } from '../fileStorageProvider';
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

  async uploadFile(filePath: string): Promise<string> {
    const [file] = await storageInstance.bucket(this.config.bucketName).upload(filePath, this.config.options);
    // TO DO: save file.name in the database
    return file.name;
  }

  async getFileLink(fileName: string): Promise<string> {
    // TO DO: cache for 24 hours, create a variable that expires and cache for the same time
    const [url] = await storageInstance
      .bucket(this.config.bucketName)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hour from now
      });
    return url;
  }
  async deleteFile(): Promise<void> {}
}
