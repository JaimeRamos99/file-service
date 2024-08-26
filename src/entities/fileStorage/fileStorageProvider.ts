export interface IFileStorageProvider {
    uploadFile(filePath: string): Promise<void>;
    getFileLink(): Promise<string>;
    deleteFile(): Promise<void>;
}

export interface IStorageConfig {
    bucketName: string;
    options: Record<string, any>
}