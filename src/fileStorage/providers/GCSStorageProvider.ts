import { IFileStorageProvider, IStorageConfig } from '../fileStorageProvider';
import { env } from '../../utils/secretManager';
import { Storage } from '@google-cloud/storage';

const storageInstance = new Storage(); // Shared instance initialized once

export default class GCSStorageProvider implements IFileStorageProvider {
    private config: IStorageConfig;

    constructor() {
        this.config = env.GCSCONFIG;
    }

    async uploadFile(filePath: string): Promise<void> {
        await storageInstance.bucket(this.config.bucketName).upload(filePath, this.config.options);
    };

    async getFileLink(): Promise<string> {
        return ''
    }
    async deleteFile(): Promise<void> {

    }
} 