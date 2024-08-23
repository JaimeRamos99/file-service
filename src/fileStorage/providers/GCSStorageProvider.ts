import { IFileStorageProvider, IStorageConfig } from '../../interfaces/fileStorageProvider';
import { env } from '../../utils/secretManager';
import { Storage } from '@google-cloud/storage';

export default class GCSStorageProvider implements IFileStorageProvider {
    private config: IStorageConfig;
    private storageInstance: Storage;

    constructor() {
        this.config = env.GCSCONFIG;
        this.storageInstance = new Storage();
    }

    async uploadFile(): Promise<string> {
        const response = await this.storageInstance.bucket(this.config.bucketName).upload('', this.config.options);
        return '';
    };

    async getFileLink(): Promise<string> {
        return ''
    }
    async deleteFile(): Promise<void> {

    }
} 